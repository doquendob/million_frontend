import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddPropertyForm from '../AddPropertyForm';
import { Category } from '@/types';

describe('AddPropertyForm', () => {
  const mockOnAdd = jest.fn();
  const mockCategories: Category[] = [
    { id: '1', name: 'House', color: '#3B82F6' },
    { id: '2', name: 'Apartment', color: '#10B981' },
    { id: '3', name: 'Land', color: '#F59E0B' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock fetch globally to prevent actual API calls
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders all form fields', async () => {
    const user = userEvent.setup();
    render(<AddPropertyForm onAdd={mockOnAdd} categories={mockCategories} />);

    // Open the form
    const openButton = screen.getByText('Add New Property');
    await user.click(openButton);

    expect(screen.getByLabelText(/property name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByText(/property type/i)).toBeInTheDocument();
  });

  it('displays category options', async () => {
    const user = userEvent.setup();
    render(<AddPropertyForm onAdd={mockOnAdd} categories={mockCategories} />);

    // Open the form
    const openButton = screen.getByText('Add New Property');
    await user.click(openButton);

    mockCategories.forEach(category => {
      expect(screen.getByText(category.name)).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    render(<AddPropertyForm onAdd={mockOnAdd} categories={mockCategories} />);

    // Open the form
    const openButton = screen.getByText('Add New Property');
    await user.click(openButton);

    // Fill in form fields
    await user.type(screen.getByLabelText(/property name/i), 'Beautiful Beach House');
    await user.type(screen.getByLabelText(/address/i), '123 Ocean Drive');
    await user.type(screen.getByLabelText(/price/i), '500000');
    await user.type(screen.getByLabelText(/description/i), 'A stunning property by the ocean');

    // Select category using dropdown (not clicking button)
    const typeSelect = screen.getByLabelText(/property type/i);
    await user.selectOptions(typeSelect, 'House');

    // Submit form
    const submitButton = screen.getByRole('button', { name: /add property/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnAdd).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Beautiful Beach House',
          addressProperty: '123 Ocean Drive',
          priceProperty: 500000,
          description: 'A stunning property by the ocean',
          type: 'House',
          active: true,
        })
      );
    });
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();
    render(<AddPropertyForm onAdd={mockOnAdd} categories={mockCategories} />);

    // Open the form
    const openButton = screen.getByText('Add New Property');
    await user.click(openButton);

    // Try to submit without filling required fields
    const submitButton = screen.getByRole('button', { name: /add property/i });
    await user.click(submitButton);

    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  it('validates price is a positive number', async () => {
    const user = userEvent.setup();
    render(<AddPropertyForm onAdd={mockOnAdd} categories={mockCategories} />);

    // Open the form
    const openButton = screen.getByText('Add New Property');
    await user.click(openButton);

    await user.type(screen.getByLabelText(/property name/i), 'Test Property');
    await user.type(screen.getByLabelText(/address/i), '123 Test St');
    await user.type(screen.getByLabelText(/price/i), '-100');

    const submitButton = screen.getByRole('button', { name: /add property/i });
    await user.click(submitButton);

    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  it('closes form after successful submission', async () => {
    const user = userEvent.setup();
    render(<AddPropertyForm onAdd={mockOnAdd} categories={mockCategories} />);

    // Open the form
    const openButton = screen.getByText('Add New Property');
    await user.click(openButton);

    const nameInput = screen.getByLabelText(/property name/i) as HTMLInputElement;
    const descriptionInput = screen.getByLabelText(/description/i) as HTMLTextAreaElement;
    const addressInput = screen.getByLabelText(/address/i) as HTMLInputElement;
    const priceInput = screen.getByLabelText(/price/i) as HTMLInputElement;

    await user.type(nameInput, 'Test Property');
    await user.type(descriptionInput, 'Test description');
    await user.type(addressInput, '123 Test St');
    await user.type(priceInput, '250000');

    const submitButton = screen.getByRole('button', { name: /add property/i });
    await user.click(submitButton);

    // Form should close after submission
    await waitFor(() => {
      expect(mockOnAdd).toHaveBeenCalled();
      // Form is closed, so the button should be back to "Add New Property"
      expect(screen.getByText('Add New Property')).toBeInTheDocument();
    });
  });

  it('allows selecting different property types', async () => {
    const user = userEvent.setup();
    render(<AddPropertyForm onAdd={mockOnAdd} categories={mockCategories} />);

    // Open the form
    const openButton = screen.getByText('Add New Property');
    await user.click(openButton);

    // Select property type from dropdown
    const typeSelect = screen.getByLabelText(/property type/i);
    await user.selectOptions(typeSelect, 'Apartment');

    // Fill in required fields
    await user.type(screen.getByLabelText(/property name/i), 'City Apartment');
    await user.type(screen.getByLabelText(/description/i), 'Modern apartment in city center');
    await user.type(screen.getByLabelText(/address/i), '456 City Center');
    await user.type(screen.getByLabelText(/price/i), '300000');

    const submitButton = screen.getByRole('button', { name: /add property/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnAdd).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'Apartment',
        })
      );
    });
  });

  it('handles form submission without optional fields', async () => {
    const user = userEvent.setup();
    render(<AddPropertyForm onAdd={mockOnAdd} categories={mockCategories} />);

    // Open the form
    const openButton = screen.getByText('Add New Property');
    await user.click(openButton);

    // Fill only required fields
    await user.type(screen.getByLabelText(/property name/i), 'Minimal Property');
    await user.type(screen.getByLabelText(/description/i), 'Basic property');
    await user.type(screen.getByLabelText(/address/i), '789 Basic St');
    await user.type(screen.getByLabelText(/price/i), '200000');

    const submitButton = screen.getByRole('button', { name: /add property/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnAdd).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Minimal Property',
          addressProperty: '789 Basic St',
          priceProperty: 200000,
          active: true,
        })
      );
    });
  });

  it('shows visual feedback for selected category', async () => {
    const user = userEvent.setup();
    render(<AddPropertyForm onAdd={mockOnAdd} categories={mockCategories} />);

    // Open the form
    const openButton = screen.getByText('Add New Property');
    await user.click(openButton);

    const typeSelect = screen.getByLabelText(/property type/i) as HTMLSelectElement;
    await user.selectOptions(typeSelect, 'Apartment');

    // The selected option should be reflected
    expect(typeSelect.value).toBe('Apartment');
  });

  it('disables submit button while uploading image', async () => {
    const user = userEvent.setup();

    // Mock the uploadImage API call to take some time
    (global.fetch as jest.Mock) = jest.fn().mockImplementation(() =>
      new Promise(resolve =>
        setTimeout(() => resolve({
          ok: true,
          json: async () => ({ imageUrl: '/test.jpg', fileName: 'test.jpg' })
        }), 100)
      )
    );

    render(<AddPropertyForm onAdd={mockOnAdd} categories={mockCategories} />);

    // Open the form
    const openButton = screen.getByText('Add New Property');
    await user.click(openButton);

    // Fill in required fields
    await user.type(screen.getByLabelText(/property name/i), 'Test Property');
    await user.type(screen.getByLabelText(/description/i), 'Test description');
    await user.type(screen.getByLabelText(/address/i), '123 Test St');
    await user.type(screen.getByLabelText(/price/i), '250000');

    // Upload a file
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    await user.upload(fileInput, file);

    // Submit the form - button should be disabled while uploading
    const submitButton = screen.getByRole('button', { name: /add property/i });
    await user.click(submitButton);

    // Button should be disabled while uploading
    expect(submitButton).toBeDisabled();
  });

  it('handles image upload', async () => {
    const user = userEvent.setup();
    render(<AddPropertyForm onAdd={mockOnAdd} categories={mockCategories} />);

    // Open the form
    const openButton = screen.getByText('Add New Property');
    await user.click(openButton);

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;

    await user.upload(fileInput, file);

    expect(fileInput.files?.[0]).toBe(file);
    expect(fileInput.files).toHaveLength(1);
  });

  it('displays image preview after upload', async () => {
    const user = userEvent.setup();
    render(<AddPropertyForm onAdd={mockOnAdd} categories={mockCategories} />);

    // Open the form
    const openButton = screen.getByText('Add New Property');
    await user.click(openButton);

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;

    await user.upload(fileInput, file);

    await waitFor(() => {
      const preview = screen.getByAltText(/preview/i);
      expect(preview).toBeInTheDocument();
    });
  });
});
