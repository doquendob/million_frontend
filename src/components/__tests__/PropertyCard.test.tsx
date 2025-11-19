/**
 * PropertyCard Component Tests
 */

import { render, screen, fireEvent } from '@testing-library/react'
import PropertyCard from '../PropertyCard'
import { Property } from '@/types'

const mockProperty: Property = {
    id: '1',
    name: 'Beautiful House',
    description: 'A beautiful house in the city',
    addressProperty: '123 Main St, City',
    type: 'House',
    priceProperty: 500000,
    imageUrl: 'https://example.com/image.jpg',
    active: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    idOwner: 'owner123',
}

describe('PropertyCard', () => {
    const mockOnView = jest.fn()
    const mockOnDelete = jest.fn()

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('renders property information correctly', () => {
        render(
            <PropertyCard
                property={mockProperty}
                onView={mockOnView}
                onDelete={mockOnDelete}
            />
        )

        expect(screen.getByText('Beautiful House')).toBeInTheDocument()
        expect(screen.getByText('123 Main St, City')).toBeInTheDocument()
        expect(screen.getByText('$500,000')).toBeInTheDocument()
        expect(screen.getByText('House')).toBeInTheDocument()
    })

    it('does not display inactive badge for active properties', () => {
        render(
            <PropertyCard
                property={mockProperty}
                onView={mockOnView}
                onDelete={mockOnDelete}
            />
        )

        expect(screen.queryByText('Inactive')).not.toBeInTheDocument()
    })

    it('displays inactive status badge for inactive properties', () => {
        const inactiveProperty = { ...mockProperty, active: false }

        render(
            <PropertyCard
                property={inactiveProperty}
                onView={mockOnView}
                onDelete={mockOnDelete}
            />
        )

        expect(screen.getByText('Inactive')).toBeInTheDocument()
    })

    it('calls onView when View button is clicked', () => {
        render(
            <PropertyCard
                property={mockProperty}
                onView={mockOnView}
                onDelete={mockOnDelete}
            />
        )

        const viewButton = screen.getByText('View')
        fireEvent.click(viewButton)

        expect(mockOnView).toHaveBeenCalledTimes(1)
        expect(mockOnView).toHaveBeenCalledWith(mockProperty.id)
    })

    it('calls onDelete when Delete button is clicked', () => {
        render(
            <PropertyCard
                property={mockProperty}
                onView={mockOnView}
                onDelete={mockOnDelete}
            />
        )

        const buttons = screen.getAllByRole('button')
        const deleteButton = buttons[1] // Second button is delete
        fireEvent.click(deleteButton)

        expect(mockOnDelete).toHaveBeenCalledTimes(1)
        expect(mockOnDelete).toHaveBeenCalledWith(mockProperty.id)
    })

    it('renders image with correct src and alt text', () => {
        render(
            <PropertyCard
                property={mockProperty}
                onView={mockOnView}
                onDelete={mockOnDelete}
            />
        )

        const image = screen.getByAltText('Beautiful House')
        expect(image).toHaveAttribute('src', mockProperty.imageUrl)
    })

    it('renders placeholder when imageUrl is not provided', () => {
        const propertyWithoutImage = { ...mockProperty, imageUrl: undefined };

        render(
            <PropertyCard
                property={propertyWithoutImage}
                onView={mockOnView}
                onDelete={mockOnDelete}
            />
        )

        // Component shows "No image" text instead of img tag
        expect(screen.getByText('No image')).toBeInTheDocument();
    })

    it('formats price correctly with US locale', () => {
        const expensiveProperty = { ...mockProperty, priceProperty: 1250000 }

        render(
            <PropertyCard
                property={expensiveProperty}
                onView={mockOnView}
                onDelete={mockOnDelete}
            />
        )

        expect(screen.getByText('$1,250,000')).toBeInTheDocument()
    })

    it('applies hover effects on card', () => {
        const { container } = render(
            <PropertyCard
                property={mockProperty}
                onView={mockOnView}
                onDelete={mockOnDelete}
            />
        )

        const card = container.firstChild
        expect(card).toHaveClass('hover:shadow-xl') // Updated to match actual class
    })
})
