import { useEffect, useRef, useState } from 'react';
import { TodoAgregate } from '../../types/TodoAgregate';
import { USER_ID } from '../../api/todos';
import { TodoError, TodoServiceErrors } from '../../types/Errors';

type TodoFormProps = {
  onSubmit: (newTodo: TodoAgregate) => Promise<void>;
  setErrorMessage: React.Dispatch<React.SetStateAction<TodoError | null>>;
  isLoading: boolean;
  inputFocusRef?: React.MutableRefObject<() => void>;
};

export const TodoForm = ({
  onSubmit,
  setErrorMessage,
  isLoading,
  inputFocusRef,
}: TodoFormProps) => {
  const [todoTitle, setTodoTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();

    if (inputFocusRef) {
      // eslint-disable-next-line no-param-reassign
      inputFocusRef.current = () => {
        inputRef.current?.focus();
      };
    }
  }, [inputFocusRef]);

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    setTodoTitle(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!todoTitle.trim()) {
      setErrorMessage(TodoServiceErrors.TitleShouldNotBeEmpty);

      return;
    }

    try {
      await onSubmit({
        userId: USER_ID,
        title: todoTitle.trim(),
        completed: false,
      });
      setTodoTitle('');
    } catch (error) {
      setErrorMessage(TodoServiceErrors.UnableToAdd);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={todoTitle}
        onChange={handleInputChange}
        disabled={isLoading}
      />
    </form>
  );
};
