import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import { addTodo, deleteTodo, getTodos, updateTodo } from '../api/todos';
import { TodoError, TodoServiceErrors } from '../types/Errors';
import { TodoAgregate } from '../types/TodoAgregate';
import { getSuccessfulIds } from '../utils/getSuccessfulIds';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<TodoError | null>(null);
  const [initialLoading, setInitialLoading] = useState(false);
  const [processingTodoIds, setProcessingTodoIds] = useState<Todo['id'][]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const inputFocusRef = useRef<() => void>(() => {});

  const TEMP_ID = 0;

  const allTodosCompleted = useMemo(
    () => todos.every(todo => todo.completed),
    [todos],
  );
  const itemsLeft = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );

  const hasCompletedTodos = useMemo(
    () => todos.some(todo => todo.completed),
    [todos],
  );

  const handleAddTodoToProcessing = (todoId: Todo['id']) => {
    setProcessingTodoIds(current => [...current, todoId]);
  };

  const handleRemoveTodoFromProcessing = (todoId: Todo['id']) => {
    setProcessingTodoIds(current => current.filter(id => id !== todoId));
  };

  const replaceTodoInList = (updated: Todo) => {
    setTodos(current =>
      current.map(todo => (todo.id === updated.id ? updated : todo)),
    );
  };

  const handleErrors = useCallback(
    (error: unknown, fallbackMessage: TodoError) => {
      if (error instanceof Error) {
        setErrorMessage(fallbackMessage);

        return;
      }

      setErrorMessage(TodoServiceErrors.Unknown);
    },
    [],
  );

  const loadTodos = useCallback(async () => {
    setInitialLoading(true);
    setErrorMessage(null);
    try {
      const loadedTodos = await getTodos();

      setTodos(loadedTodos);
    } catch {
      setErrorMessage(TodoServiceErrors.UnableToLoad);
    } finally {
      setInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  const handleAddTodo = async (newTodo: TodoAgregate) => {
    handleAddTodoToProcessing(TEMP_ID);
    setTempTodo({ id: TEMP_ID, ...newTodo });

    try {
      const createdTodo = await addTodo(newTodo);

      setTodos(current => [...current, createdTodo]);
    } catch (error) {
      handleErrors(error, TodoServiceErrors.UnableToAdd);

      throw error;
    } finally {
      setTempTodo(null);
      handleRemoveTodoFromProcessing(TEMP_ID);
    }
  };

  const handleDeleteTodo = useCallback(
    async (todoId: Todo['id']) => {
      handleAddTodoToProcessing(todoId);

      try {
        await deleteTodo(todoId);
        setTodos(current => current.filter(todo => todo.id !== todoId));
        inputFocusRef.current?.();
      } catch (error) {
        handleErrors(error, TodoServiceErrors.UnableToDelete);
      } finally {
        handleRemoveTodoFromProcessing(todoId);
      }
    },
    [handleErrors],
  );

  const handleToggleTodo = async (todoId: Todo['id']) => {
    const todoToUpdate = todos.find(todo => todo.id === todoId);

    if (!todoToUpdate) {
      return;
    }

    handleAddTodoToProcessing(todoId);

    try {
      const updatedTodo = await updateTodo(todoId, {
        completed: !todoToUpdate.completed,
      });

      replaceTodoInList(updatedTodo);
    } catch (error) {
      handleErrors(error, TodoServiceErrors.UnableToUpdate);
    } finally {
      handleRemoveTodoFromProcessing(todoId);
    }
  };

  const handleUpdateTodo = async (todoId: Todo['id'], newTitle: string) => {
    if (!newTitle.trim()) {
      setErrorMessage(TodoServiceErrors.TitleShouldNotBeEmpty);

      return;
    }

    handleAddTodoToProcessing(todoId);

    try {
      const updatedTodo = await updateTodo(todoId, { title: newTitle });

      replaceTodoInList(updatedTodo);
    } catch (error) {
      handleErrors(error, TodoServiceErrors.UnableToUpdate);
      throw error;
    } finally {
      handleRemoveTodoFromProcessing(todoId);
    }
  };

  const handleToggleAllTodos = async () => {
    const status = !allTodosCompleted;
    const todosToUpdate = todos.filter(todo => todo.completed !== status);

    try {
      await Promise.all(
        todosToUpdate.map(async todo => {
          handleAddTodoToProcessing(todo.id);

          try {
            const updatedTodo = await updateTodo(todo.id, {
              completed: status,
            });

            replaceTodoInList(updatedTodo);
          } catch (error) {
            handleErrors(error, TodoServiceErrors.UnableToUpdate);
          } finally {
            handleRemoveTodoFromProcessing(todo.id);
          }
        }),
      );
    } catch (error) {
      handleErrors(error, TodoServiceErrors.UnableToUpdate);
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(({ id }) => handleAddTodoToProcessing(id));

    const results = await Promise.allSettled(
      completedTodos.map(todo => deleteTodo(todo.id)),
    );

    const successfulIds = getSuccessfulIds(results, completedTodos);

    setTodos(current =>
      current.filter(todo => !successfulIds.includes(todo.id)),
    );

    if (results.some(result => result.status === 'rejected')) {
      setErrorMessage(TodoServiceErrors.UnableToDelete);
    }

    completedTodos.forEach(({ id }) => handleRemoveTodoFromProcessing(id));
    inputFocusRef.current?.();
  };

  return {
    todos,
    errorMessage,
    initialLoading,
    allTodosCompleted,
    itemsLeft,
    hasCompletedTodos,
    processingTodoIds,
    tempTodo,
    inputFocusRef,
    TEMP_ID,
    setTodos,
    setErrorMessage,
    setInitialLoading,
    handleDeleteTodo,
    handleAddTodo,
    handleToggleTodo,
    handleToggleAllTodos,
    handleUpdateTodo,
    handleClearCompleted,
  };
};
