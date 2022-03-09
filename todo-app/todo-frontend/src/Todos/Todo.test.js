import { render, screen, fireEvent } from '@testing-library/react';
import Todo from './Todo';

test('renders single todo', () => {
  const todo = {
    _id: "6225ea7530d5498968ace2c7",
    done: false,
    text: "Write code"
  }

  const deleteTodo = jest.fn();
  const completeTodo = jest.fn();

  const { getByText } = render(
    <Todo
      todo={todo}
      deleteTodo={deleteTodo}
      completeTodo={completeTodo}
    />
  );

  const todoText = screen.getByText(/write code/i);
  expect(todoText).toBeInTheDocument();

  const isTodoDone = screen.getByText(/this todo is not done/i);
  expect(isTodoDone).toBeInTheDocument();

  fireEvent.click(getByText(/set as done/i));
  expect(completeTodo).toHaveBeenCalledTimes(1);

  fireEvent.click(getByText(/delete/i));
  expect(deleteTodo).toHaveBeenCalledTimes(1);
});
