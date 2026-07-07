import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MobileNav } from './mobile-nav'

jest.mock('next/link', () => {
  const MockLink = ({ children, href, onClick, className }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    return (
      <a href={href} onClick={onClick} className={className} data-testid="mock-link">
        {children}
      </a>
    )
  }
  MockLink.displayName = 'MockLink'
  return MockLink
})

describe('MobileNav Component', () => {
  it('renders the trigger button', () => {
    render(<MobileNav />)
    expect(screen.getByRole('button', { name: /open menu/i })).toBeInTheDocument()
  })

  it('opens the dropdown and displays navigation links when clicked', async () => {
    render(<MobileNav />)
    const trigger = screen.getByRole('button', { name: /open menu/i })
    fireEvent.click(trigger)

    await waitFor(() => {
      expect(screen.getByText('Projects')).toBeInTheDocument()
      expect(screen.getByText('Skills')).toBeInTheDocument()
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
      expect(screen.getByText('Contact')).toBeInTheDocument()
    })
  })

  it('closes the dropdown when a link is clicked', async () => {
    render(<MobileNav />)
    const trigger = screen.getByRole('button', { name: /open menu/i })
    fireEvent.click(trigger)

    await waitFor(() => {
      expect(screen.getByText('Projects')).toBeInTheDocument()
    })

    const projectLink = screen.getByText('Projects')
    fireEvent.click(projectLink)

    await waitFor(() => {
      expect(screen.queryByText('Projects')).not.toBeInTheDocument()
    })
  })
})
