/* eslint-disable jsx-a11y/label-has-associated-control */
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import React, { useEffect, useRef, useState } from 'react';

type TodoItemProps = {
  todo: Todo;
  onDelete?: (todoId: Todo['id']) => Promise<void>;
  isLoading: boolean;
  onToggle?: (todoId: Todo['id']) => Promise<void>;
  onUpdate?: (todoId: Todo['id'], newTitle: string) => Promise<void>;
};

const TodoItemComponent = ({
  todo,
  onDelete,
  isLoading,
  onToggle,
  onUpdate,
}: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDelete = () => {
    onDelete?.(todo.id);
  };

  useEffect(() => {
    if (isEditing) {
      setUpdatedTitle(todo.title);
      inputRef.current?.focus();
    }
  }, [isEditing, todo.title]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedTitle(event.target.value);
  };

  const handleFinishEditing = async () => {
    const trimmed = updatedTitle.trim();

    if (!trimmed) {
      handleDelete();
    } else if (trimmed !== todo.title) {
      if (onUpdate) {
        await onUpdate(todo.id, trimmed);
      }
    }

    setIsEditing(false);
  };

  const handleSubmitEditing = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    await handleFinishEditing();
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsEditing(false);
        setUpdatedTitle(todo.title);
      }
    };

    if (isEditing) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditing, todo.title]);

  return (
    <div
      data-cy="Todo"
      className={cn('todo', 'item-enter-done', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onToggle?.(todo.id)}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmitEditing}>
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={updatedTitle}
            onChange={handleInputChange}
            onBlur={handleFinishEditing}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => setIsEditing(true)}
        >
          {todo.title}
        </span>
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={handleDelete}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export const TodoItem = React.memo(TodoItemComponent);
