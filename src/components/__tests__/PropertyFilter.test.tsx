import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PropertyFilter from '../PropertyFilter';
import { PropertyFilter as PropertyFilterType, Category } from '@/types';

describe('PropertyFilter', () => {
    const mockCategories: Category[] = [
        { id: '1', name: 'House', color: '#3B82F6' },
        { id: '2', name: 'Apartment', color: '#10B981' },
        { id: '3', name: 'Land', color: '#F59E0B' },
    ];

    const mockFilter: PropertyFilterType = {
        name: '',
        address: '',
        priceMin: null,
        priceMax: null,
        type: null,
        active: null,
    };

    const mockOnChange = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders all filter inputs', () => {
        render(
            <PropertyFilter
                filter={mockFilter}
                onChange={mockOnChange}
                categories={mockCategories}
            />
        );

        expect(screen.getByPlaceholderText(/search by name/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/search by address/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/min price/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/max price/i)).toBeInTheDocument();
    });

    it('displays current filter values', () => {
        const activeFilter: PropertyFilterType = {
            name: 'Beach House',
            address: 'Ocean Ave',
            priceMin: 100000,
            priceMax: 500000,
            type: 'House',
            active: true,
        };

        render(
            <PropertyFilter
                filter={activeFilter}
                onChange={mockOnChange}
                categories={mockCategories}
            />
        );

        expect(screen.getByDisplayValue('Beach House')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Ocean Ave')).toBeInTheDocument();
        expect(screen.getByDisplayValue('100000')).toBeInTheDocument();
        expect(screen.getByDisplayValue('500000')).toBeInTheDocument();
    });

    it('calls onChange when name input changes', () => {
        render(
            <PropertyFilter
                filter={mockFilter}
                onChange={mockOnChange}
                categories={mockCategories}
            />
        );

        const nameInput = screen.getByPlaceholderText(/search by name/i);
        fireEvent.change(nameInput, { target: { value: 'Villa' } });

        expect(mockOnChange).toHaveBeenCalledWith({
            ...mockFilter,
            name: 'Villa',
        });
    });

    it('calls onChange when address input changes', () => {
        render(
            <PropertyFilter
                filter={mockFilter}
                onChange={mockOnChange}
                categories={mockCategories}
            />
        );

        const addressInput = screen.getByPlaceholderText(/search by address/i);
        fireEvent.change(addressInput, { target: { value: 'Main St' } });

        expect(mockOnChange).toHaveBeenCalledWith({
            ...mockFilter,
            address: 'Main St',
        });
    });

    it('calls onChange when price min changes', () => {
        render(
            <PropertyFilter
                filter={mockFilter}
                onChange={mockOnChange}
                categories={mockCategories}
            />
        );

        const priceMinInput = screen.getByPlaceholderText(/min price/i);
        fireEvent.change(priceMinInput, { target: { value: '200000' } });

        expect(mockOnChange).toHaveBeenCalledWith({
            ...mockFilter,
            priceMin: 200000,
        });
    });

    it('calls onChange when price max changes', () => {
        render(
            <PropertyFilter
                filter={mockFilter}
                onChange={mockOnChange}
                categories={mockCategories}
            />
        );

        const priceMaxInput = screen.getByPlaceholderText(/max price/i);
        fireEvent.change(priceMaxInput, { target: { value: '800000' } });

        expect(mockOnChange).toHaveBeenCalledWith({
            ...mockFilter,
            priceMax: 800000,
        });
    });

    it('renders Clear All button when filters are active', () => {
        const activeFilter: PropertyFilterType = {
            name: 'House',
            address: '',
            priceMin: null,
            priceMax: null,
            type: null,
            active: null,
        };

        render(
            <PropertyFilter
                filter={activeFilter}
                onChange={mockOnChange}
                categories={mockCategories}
            />
        );

        expect(screen.getByText(/clear all/i)).toBeInTheDocument();
    });

    it('does not render Clear All button when no filters are active', () => {
        render(
            <PropertyFilter
                filter={mockFilter}
                onChange={mockOnChange}
                categories={mockCategories}
            />
        );

        expect(screen.queryByText(/clear all/i)).not.toBeInTheDocument();
    });

    it('clears all filters when Clear All button is clicked', () => {
        const activeFilter: PropertyFilterType = {
            name: 'Test',
            address: 'Test Address',
            priceMin: 100000,
            priceMax: 500000,
            type: 'House',
            active: true,
        };

        render(
            <PropertyFilter
                filter={activeFilter}
                onChange={mockOnChange}
                categories={mockCategories}
            />
        );

        const clearButton = screen.getByText(/clear all/i);
        fireEvent.click(clearButton);

        expect(mockOnChange).toHaveBeenCalledWith({
            name: '',
            address: '',
            priceMin: null,
            priceMax: null,
            type: null,
            active: null,
        });
    });

    it('renders category filter options', () => {
        render(
            <PropertyFilter
                filter={mockFilter}
                onChange={mockOnChange}
                categories={mockCategories}
            />
        );

        expect(screen.getByText('House')).toBeInTheDocument();
        expect(screen.getByText('Apartment')).toBeInTheDocument();
        expect(screen.getByText('Land')).toBeInTheDocument();
    });

    it('handles empty price inputs correctly', async () => {
        const filterWithPrice: PropertyFilterType = {
            ...mockFilter,
            priceMin: 100000,
        };

        render(
            <PropertyFilter
                filter={filterWithPrice}
                onChange={mockOnChange}
                categories={mockCategories}
            />
        );

        const priceMinInput = screen.getByPlaceholderText(/min price/i);
        fireEvent.change(priceMinInput, { target: { value: '' } });

        await waitFor(() => {
            expect(mockOnChange).toHaveBeenCalledWith({
                ...filterWithPrice,
                priceMin: null,
            });
        });
    });
});
