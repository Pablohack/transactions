import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from './Modal';

describe('Modal Component', () => {
  it('should not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={() => {}} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );
    
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
  });

  it('should render when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );
    
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    
    render(
      <Modal isOpen={true} onClose={handleClose} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );
    
    const closeButton = screen.getByRole('button', { name: /cerrar/i });
    await user.click(closeButton);
    
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when backdrop is clicked', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    
    render(
      <Modal isOpen={true} onClose={handleClose} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );
    
    // Click en el backdrop (el div exterior con fixed)
    const backdrop = screen.getByText('Test Modal').closest('.fixed');
    if (backdrop) {
      await user.click(backdrop);
      expect(handleClose).toHaveBeenCalled();
    }
  });

  it('should not call onClose when modal content is clicked', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    
    render(
      <Modal isOpen={true} onClose={handleClose} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );
    
    const modalContent = screen.getByText('Modal content');
    await user.click(modalContent);
    
    expect(handleClose).not.toHaveBeenCalled();
  });

  it('should render with custom size', () => {
    const { container } = render(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal" size="lg">
        <p>Modal content</p>
      </Modal>
    );
    
    const modalContent = container.querySelector('.max-w-2xl');
    expect(modalContent).toBeInTheDocument();
  });

  it('should have correct accessibility attributes', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });
});
