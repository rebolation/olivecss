import { render, screen } from '@testing-library/svelte'
import { describe, it, expect } from 'vitest'
import '@testing-library/jest-dom'
import App from './TestComponent.svelte'

describe('App.svelte', () => {
  it('renders greeting', () => {
    render(App, { props: { name: 'World' } })
    expect(screen.getByText('Hello World!')).toBeInTheDocument()
  })

  it('renders default greeting', () => {
    render(App)
    expect(screen.getByText('Hello Svelte!')).toBeInTheDocument()
  })

  describe('class transformation', () => {
    it('transforms class comments to class attribute', () => {
      render(App)
      const element = document.getElementById('transforms_class_comments_to_class_attribute')
      expect(element).toHaveClass('btn-primary')
    })

    it('merges multiple class comments', () => {
      render(App)
      const element = document.getElementById('merges_multiple_class_comments')
      expect(element).toHaveClass('btn-primary')
      expect(element).toHaveClass('text-center')
      expect(element).toHaveClass('mt-4')
    })

    it('merges with existing class', () => {
      render(App)
      const element = document.getElementById('merges_with_existing_class')
      expect(element).toHaveClass('existing-class')
      expect(element).toHaveClass('btn-primary')
    })
  })

  describe('style transformation', () => {
    it('transforms style comments to style attribute', () => {
      render(App)
      const element = document.getElementById('transforms_style_comments_to_style_attribute')
      expect(element).toHaveStyle({ color: 'rgb(255, 0, 0)', marginTop: '10px' })
    })

    it('merges multiple style comments', () => {
      render(App)
      const element = document.getElementById('merges_multiple_style_comments')
      expect(element).toHaveStyle({ 
        color: 'rgb(255, 0, 0)', 
        marginTop: '10px', 
        padding: '20px' 
      })
    })

    it('merges with existing style', () => {
      render(App)
      const element = document.getElementById('merges_with_existing_style')
      expect(element).toHaveStyle({ 
        fontSize: '16px', 
        color: 'rgb(255, 0, 0)', 
        marginTop: '10px' 
      })
    })

    it('handles complex style properties', () => {
      render(App)
      const element = document.getElementById('handles_complex_style_properties')
      expect(element).toHaveStyle({
        backgroundColor: 'rgb(240, 240, 240)',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      })
    })
  })

  describe('conditional rendering', () => {
    it('renders conditional content with class when condition is true', () => {
      render(App, { props: { isVisible: true } })
      const element = document.getElementById('renders_conditional_content_with_class_when_condition_is_true')
      expect(element).toHaveClass('visible-content')
    })

    it('does not render conditional content when condition is false', () => {
      render(App, { props: { isVisible: false } })
      const element = document.getElementById('renders_conditional_content_with_class_when_condition_is_true')
      expect(element).toBeFalsy()
    })

    it('renders conditional content with style when condition is true', () => {
      render(App, { props: { isError: true } })
      const element = document.getElementById('renders_conditional_content_with_style_when_condition_is_true')
      expect(element).toHaveStyle({ 
        color: 'rgb(255, 0, 0)', 
        backgroundColor: 'rgb(255, 238, 238)' 
      })
    })

    it('does not render conditional content with style when condition is false', () => {
      render(App, { props: { isError: false } })
      const element = document.getElementById('renders_conditional_content_with_style_when_condition_is_true')
      expect(element).toBeFalsy()
    })

    it('renders active state when isActive is true', () => {
      render(App, { props: { isActive: true } })
      const element = document.getElementById('renders_active_state_when_isActive_is_true')
      expect(element).toHaveClass('active-state')
    })

    it('renders inactive state when isActive is false', () => {
      render(App, { props: { isActive: false } })
      const element = document.getElementById('renders_inactive_state_when_isActive_is_false')
      expect(element).toHaveClass('inactive-state')
    })
  })

  describe('list rendering', () => {
    it('renders list items with class', () => {
      render(App)
      const element0 = document.getElementById('renders_list_items_with_class_0')
      const element1 = document.getElementById('renders_list_items_with_class_1')
      const element2 = document.getElementById('renders_list_items_with_class_2')
      
      expect(element0).toHaveClass('list-item')
      expect(element1).toHaveClass('list-item')
      expect(element2).toHaveClass('list-item')
    })

    it('renders list items with style', () => {
      render(App)
      const element0 = document.getElementById('renders_list_items_with_style_0')
      const element1 = document.getElementById('renders_list_items_with_style_1')
      const element2 = document.getElementById('renders_list_items_with_style_2')
      
      expect(element0).toHaveStyle({ backgroundColor: 'rgb(255, 0, 0)' })
      expect(element1).toHaveStyle({ backgroundColor: 'rgb(255, 0, 0)' })
      expect(element2).toHaveStyle({ backgroundColor: 'rgb(255, 0, 0)' })
    })

    it('renders filtered list items', () => {
      render(App)
      const element0 = document.getElementById('renders_filtered_list_items_0')
      const element1 = document.getElementById('renders_filtered_list_items_1')
      
      expect(element0).toHaveClass('active-item')
      expect(element1).toHaveClass('active-item')
    })
  })

  describe('nested conditional rendering', () => {
    it('renders admin panel when logged in and admin', () => {
      render(App, { props: { isLoggedIn: true, isAdmin: true } })
      const element = document.getElementById('renders_admin_panel_when_logged_in_and_admin')
      expect(element).toHaveClass('admin-panel')
    })

    it('renders user panel when logged in but not admin', () => {
      render(App, { props: { isLoggedIn: true, isAdmin: false } })
      const element = document.getElementById('renders_user_panel_when_logged_in_but_not_admin')
      expect(element).toHaveClass('user-panel')
    })

    it('renders login form when not logged in', () => {
      render(App, { props: { isLoggedIn: false } })
      const element = document.getElementById('renders_login_form_when_not_logged_in')
      expect(element).toHaveClass('login-form')
    })
  })

  describe('combined class and style', () => {
    it('applies both class and style simultaneously', () => {
      render(App)
      const element = document.getElementById('applies_both_class_and_style_simultaneously')
      expect(element).toHaveClass('btn-primary')
      expect(element).toHaveStyle({ color: 'rgb(255, 0, 0)', marginTop: '10px' })
    })

    it('applies conditional class with existing style', () => {
      render(App, { props: { isHighlighted: true } })
      const element = document.getElementById('applies_conditional_class_with_existing_style_highlighted')
      expect(element).toHaveClass('highlighted-text')
    })

    it('applies multiple comments in conditional rendering', () => {
      render(App, { props: { showDetails: true } })
      const element = document.getElementById('applies_multiple_comments_in_conditional_rendering')
      expect(element).toHaveClass('detail-container')
      expect(element).toHaveStyle({ padding: '20px', marginTop: '10px' })
    })
  })

  describe('edge cases', () => {
    it('ignores empty comments', () => {
      render(App)
      const element = document.getElementById('ignores_empty_comments')
      expect(element).toHaveClass('btn-primary')
    })

    it('renders elements without comments unchanged', () => {
      render(App)
      const element = document.getElementById('renders_elements_without_comments_unchanged')
      const spanElement = element.querySelector('span')
      expect(spanElement).toBeTruthy()
      expect(spanElement.textContent).toBe('Hello World')
      // 주석이 없으므로 span에는 class나 style이 추가되지 않아야 함
      expect(spanElement.className).toBe('')
    })

    it('handles array destructuring in each blocks', () => {
      render(App)
      const element0 = document.getElementById('handles_array_destructuring_in_each_blocks_0')
      const element1 = document.getElementById('handles_array_destructuring_in_each_blocks_1')
      
      expect(element0).toHaveClass('user-card')
      expect(element1).toHaveClass('user-card')
    })
  })

  describe('nested structure', () => {
    it('applies class to nested elements', () => {
      render(App)
      const headerElement = document.getElementById('applies_class_to_nested_header')
      const mainElement = document.getElementById('applies_class_to_nested_main')
      
      expect(headerElement).toHaveClass('header-class')
      expect(mainElement).toHaveClass('main-content')
    })
  })
})