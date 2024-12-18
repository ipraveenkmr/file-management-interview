import { render, fireEvent, screen } from '@testing-library/react';
import FileUpload from "./components/FileUpload";
import '@testing-library/jest-dom';

test('upload button is enabled when a file is selected and the file is uploaded', async () => {
    const mockOnUpload = jest.fn();

    render(<FileUpload onUpload={mockOnUpload} />);

    // Simulate clicking the button to trigger file selection
    const browseButton = screen.getByText(/or browse your files/i);
    fireEvent.click(browseButton);

    // Simulate selecting a file
    const fileInput = screen.getByTestId('file-input'); // We'll use data-testid for the input
    const file = new File(['sample text'], 'sample.txt', { type: 'text/plain' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Ensure the file name is displayed
    expect(screen.getByText('sample.txt')).toBeInTheDocument();

    // Ensure the upload button is enabled
    const uploadButton = screen.getByRole('button', { name: /upload/i });
    expect(uploadButton).toBeEnabled();

    // Simulate clicking the upload button
    fireEvent.click(uploadButton);

    // Ensure the onUpload function is called with the correct file
    expect(mockOnUpload).toHaveBeenCalledTimes(1);
    expect(mockOnUpload).toHaveBeenCalledWith(file);
});
