import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { ErrorNotification } from './components/TodoErrorNotification';
import { useTodos } from './hooks/useTodos';
import { useFilteredTodos } from './hooks/useFilteredTodos';
import { ToggleAllButton } from './components/ToggleAllButton';
import { TodoForm } from './components/TodoForm/TodoForm';
import { TodoFooterNav } from './components/TodoFooterNav/TodoFooterNav';
import { ClearCompletedBtn } from './components/ClearCompletedBtn';
import { TodoItem } from './components/TodoItem';

export const App: React.FC = () => {
  const {
    todos,
    errorMessage,
    initialLoading,
    allTodosCompleted,
    itemsLeft,
    hasCompletedTodos,
    processingTodoIds,
    tempTodo,
    inputFocusRef,
    setErrorMessage,
    handleDeleteTodo,
    handleAddTodo,
    handleToggleTodo,
    handleToggleAllTodos,
    handleUpdateTodo,
    handleClearCompleted,
  } = useTodos();

  const { visibleTodos, filterParam, setFilterParam } = useFilteredTodos(todos);

  const resetError = () => setErrorMessage(null);
  const todoListIsNotEmpty = todos.length > 0;
  const loading = (id: number) => processingTodoIds.includes(id);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {!initialLoading && todoListIsNotEmpty && (
            <ToggleAllButton
              allCompleted={allTodosCompleted}
              onToggleAll={handleToggleAllTodos}
            />
          )}

          <TodoForm
            onSubmit={handleAddTodo}
            setErrorMessage={setErrorMessage}
            isLoading={loading(0)}
            inputFocusRef={inputFocusRef}
          />
        </header>

        {!initialLoading && (
          <section className="todoapp__main" data-cy="TodoList">
            <TransitionGroup>
              {visibleTodos.map(todo => (
                <CSSTransition
                  key={todo.id}
                  timeout={300}
                  classNames="item"
                  appear
                >
                  <TodoItem
                    todo={todo}
                    onDelete={handleDeleteTodo}
                    isLoading={loading(todo.id)}
                    onToggle={handleToggleTodo}
                    onUpdate={handleUpdateTodo}
                  />
                </CSSTransition>
              ))}
              {tempTodo && (
                <CSSTransition
                  key={tempTodo.id}
                  timeout={300}
                  classNames="temp-item"
                  appear
                >
                  <TodoItem todo={tempTodo} isLoading={true} />
                </CSSTransition>
              )}
            </TransitionGroup>
          </section>
        )}

        {todoListIsNotEmpty && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${itemsLeft} items left`}
            </span>

            <TodoFooterNav
              filterParam={filterParam}
              setFilterParam={setFilterParam}
            />

            <ClearCompletedBtn
              hasCompleted={hasCompletedTodos}
              onClearCompleted={handleClearCompleted}
            />
          </footer>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onClose={resetError}
        setError={setErrorMessage}
      />
    </div>
  );
};
