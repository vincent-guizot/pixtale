import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Logo } from '@/components/layout/Logo';
import { PageTransition } from '@/components/layout/PageTransition';
import { PostGridItem } from '@/components/posts/PostGridItem';
import { usePostModalStore } from '@/stores/postModalStore';

// Create helper to render with react-query
function renderWithProviders(ui) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

describe('UI Components', () => {
  describe('Logo', () => {
    it('renders logo text and link correctly', () => {
      renderWithProviders(<Logo />);
      const brand = screen.getByText('PixTale');
      expect(brand).toBeInTheDocument();

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/');
    });
  });

  describe('PageTransition', () => {
    it('renders children within motion wrapper', () => {
      renderWithProviders(
        <PageTransition>
          <div data-testid="child-element">Animated Content</div>
        </PageTransition>
      );
      expect(screen.getByTestId('child-element')).toBeInTheDocument();
      expect(screen.getByText('Animated Content')).toBeInTheDocument();
    });
  });

  describe('PostGridItem', () => {
    it('renders post image and likes correctly and opens post modal on click', () => {
      const mockPost = {
        id: 77,
        imageUrl: 'https://example.com/photo.jpg',
        caption: 'Awesome sunset view',
        likesCount: 15,
      };

      renderWithProviders(<PostGridItem post={mockPost} />);

      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('src', 'https://example.com/photo.jpg');
      expect(img).toHaveAttribute('alt', 'Awesome sunset view');
      expect(screen.getByText('15 likes')).toBeInTheDocument();

      // Click post item
      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(usePostModalStore.getState().openPostId).toBe(77);
    });

    it('renders fallback caption when imageUrl is empty', () => {
      const mockPostWithoutImage = {
        id: 78,
        imageUrl: null,
        caption: 'Text only post',
        likesCount: 0,
      };

      renderWithProviders(<PostGridItem post={mockPostWithoutImage} />);
      expect(screen.getByText('Text only post')).toBeInTheDocument();
      expect(screen.getByText('0 likes')).toBeInTheDocument();
    });
  });
});
