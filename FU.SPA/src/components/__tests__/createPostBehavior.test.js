import { render, screen, cleanup } from '@testing-library/react';
import CreatePost from '../CreatePost';

/*
 * Code being worked on before behavior testing milestone.
 */
test('renderCreatePostComponent', () => { //npm run test
    render(<CreatePost/>);
    const createPostElement = screen.getByTestId('cpTest-1');


    expect(createPostElement).toBeInTheDocument();
    expect(createPostElement).toHaveTextContent('Game');
    expect(createPostElement).toHaveTextContent('Title');
})

