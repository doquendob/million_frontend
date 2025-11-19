import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../LoadingSpinner';

describe('LoadingSpinner', () => {
    it('renders loading spinner with default size', () => {
        render(<LoadingSpinner />);

        const spinner = screen.getByRole('status');
        expect(spinner).toBeInTheDocument();
    });

    it('renders with small size when specified', () => {
        render(<LoadingSpinner size="sm" />);

        const spinner = screen.getByRole('status');
        expect(spinner).toBeInTheDocument();
    });

    it('renders with large size when specified', () => {
        render(<LoadingSpinner size="lg" />);

        const spinner = screen.getByRole('status');
        expect(spinner).toBeInTheDocument();
    });

    it('displays custom text when provided', () => {
        render(<LoadingSpinner text="Loading properties..." />);

        expect(screen.getByText('Loading properties...')).toBeInTheDocument();
    });

    it('does not display text when not provided', () => {
        const { container } = render(<LoadingSpinner />);

        const textElements = container.querySelectorAll('p, span');
        expect(textElements).toHaveLength(0);
    });

    it('has loading accessibility label', () => {
        render(<LoadingSpinner />);

        expect(screen.getByLabelText(/loading/i)).toBeInTheDocument();
    });
});
