import { render, screen, fireEvent } from '@testing-library/react';
import ErrorMessage from '../ErrorMessage';

describe('ErrorMessage', () => {
    const mockOnRetry = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders error message', () => {
        render(
            <ErrorMessage
                message="Failed to load properties"
                onRetry={mockOnRetry}
            />
        );

        expect(screen.getByText('Failed to load properties')).toBeInTheDocument();
    });

    it('renders retry button when onRetry is provided', () => {
        render(
            <ErrorMessage
                message="Network error"
                onRetry={mockOnRetry}
            />
        );

        expect(screen.getByText(/try again/i)).toBeInTheDocument();
    });

    it('calls onRetry when retry button is clicked', () => {
        render(
            <ErrorMessage
                message="Something went wrong"
                onRetry={mockOnRetry}
            />
        );

        const retryButton = screen.getByText(/try again/i);
        fireEvent.click(retryButton);

        expect(mockOnRetry).toHaveBeenCalledTimes(1);
    });

    it('does not render retry button when onRetry is not provided', () => {
        render(<ErrorMessage message="Error occurred" />);

        expect(screen.queryByText(/try again/i)).not.toBeInTheDocument();
    });

    it('displays error icon', () => {
        const { container } = render(
            <ErrorMessage message="Error" onRetry={mockOnRetry} />
        );

        // Check for SVG element (error icon from lucide-react)
        const svg = container.querySelector('svg');
        expect(svg).toBeInTheDocument();
    });
});
