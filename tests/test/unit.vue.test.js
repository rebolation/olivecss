import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import VueTestComponent from './TestComponent.vue'

describe('VueTestComponent.vue', () => {
  it('renders greeting', () => {
    const wrapper = mount(VueTestComponent, { props: { name: 'World' } })
    expect(wrapper.text()).toContain('Hello World!')
  })

  it('renders default greeting', () => {
    const wrapper = mount(VueTestComponent)
    expect(wrapper.text()).toContain('Hello Vue!')
  })

  describe('class transformation', () => {
    it('transforms class comments to class attribute', () => {
      const wrapper = mount(VueTestComponent)
      const element = wrapper.find('#transforms_class_comments_to_class_attribute')
      expect(element.classes()).toContain('btn-primary')
    })

    it('merges multiple class comments', () => {
      const wrapper = mount(VueTestComponent)
      const element = wrapper.find('#merges_multiple_class_comments')
      expect(element.classes()).toContain('btn-primary')
      expect(element.classes()).toContain('text-center')
      expect(element.classes()).toContain('mt-4')
    })

    it('merges with existing class', () => {
      const wrapper = mount(VueTestComponent)
      const element = wrapper.find('#merges_with_existing_class')
      expect(element.classes()).toContain('existing-class')
      expect(element.classes()).toContain('btn-primary')
    })
  })

  describe('style transformation', () => {
    it('transforms style comments to style attribute', () => {
      const wrapper = mount(VueTestComponent)
      const element = wrapper.find('#transforms_style_comments_to_style_attribute')
      const style = element.attributes('style')
      expect(style).toContain('color: red')
      expect(style).toContain('margin-top: 10px')
    })

    it('merges multiple style comments', () => {
      const wrapper = mount(VueTestComponent)
      const element = wrapper.find('#merges_multiple_style_comments')
      const style = element.attributes('style')
      expect(style).toContain('color: red')
      expect(style).toContain('margin-top: 10px')
      expect(style).toContain('padding: 20px')
    })

    it('merges with existing style', () => {
      const wrapper = mount(VueTestComponent)
      const element = wrapper.find('#merges_with_existing_style')
      const style = element.attributes('style')
      expect(style).toContain('font-size: 16px')
      expect(style).toContain('color: red')
      expect(style).toContain('margin-top: 10px')
    })

    it('handles complex style properties', () => {
      const wrapper = mount(VueTestComponent)
      const element = wrapper.find('#handles_complex_style_properties')
      const style = element.attributes('style')
      expect(style).toContain('background-color: rgb(240, 240, 240)')
      expect(style).toContain('border-radius: 8px')
      expect(style).toContain('box-shadow: 0 2px 4px rgba(0,0,0,0.1)')
    })
  })

  describe('conditional rendering', () => {
    it('renders conditional content with class when condition is true', () => {
      const wrapper = mount(VueTestComponent, { props: { isVisible: true } })
      const element = wrapper.find('#renders_conditional_content_with_class_when_condition_is_true')
      expect(element.exists()).toBe(true)
      expect(element.classes()).toContain('visible-content')
    })

    it('does not render conditional content when condition is false', () => {
      const wrapper = mount(VueTestComponent, { props: { isVisible: false } })
      const element = wrapper.find('#renders_conditional_content_with_class_when_condition_is_true')
      expect(element.exists()).toBe(false)
    })

    it('renders conditional content with style when condition is true', () => {
      const wrapper = mount(VueTestComponent, { props: { isError: true } })
      const element = wrapper.find('#renders_conditional_content_with_style_when_condition_is_true')
      expect(element.exists()).toBe(true)
      const style = element.attributes('style')
      expect(style).toContain('color: red')
      expect(style).toContain('background-color: rgb(255, 238, 238)')
    })

    it('does not render conditional content with style when condition is false', () => {
      const wrapper = mount(VueTestComponent, { props: { isError: false } })
      const element = wrapper.find('#renders_conditional_content_with_style_when_condition_is_true')
      expect(element.exists()).toBe(false)
    })

    it('renders active state when isActive is true', () => {
      const wrapper = mount(VueTestComponent, { props: { isActive: true } })
      const element = wrapper.find('#renders_active_state_when_isActive_is_true')
      expect(element.exists()).toBe(true)
      expect(element.classes()).toContain('active-state')
    })

    it('renders inactive state when isActive is false', () => {
      const wrapper = mount(VueTestComponent, { props: { isActive: false } })
      const element = wrapper.find('#renders_inactive_state_when_isActive_is_false')
      expect(element.exists()).toBe(true)
      expect(element.classes()).toContain('inactive-state')
    })
  })

  describe('list rendering', () => {
    it('renders list items with class', () => {
      const wrapper = mount(VueTestComponent)
      const element0 = wrapper.find('#renders_list_items_with_class_0')
      const element1 = wrapper.find('#renders_list_items_with_class_1')
      const element2 = wrapper.find('#renders_list_items_with_class_2')
      
      expect(element0.exists()).toBe(true)
      expect(element0.classes()).toContain('list-item')
      expect(element1.exists()).toBe(true)
      expect(element1.classes()).toContain('list-item')
      expect(element2.exists()).toBe(true)
      expect(element2.classes()).toContain('list-item')
    })

    it('renders list items with style', () => {
      const wrapper = mount(VueTestComponent)
      const element0 = wrapper.find('#renders_list_items_with_style_0')
      const element1 = wrapper.find('#renders_list_items_with_style_1')
      const element2 = wrapper.find('#renders_list_items_with_style_2')
      
      expect(element0.exists()).toBe(true)
      expect(element0.attributes('style')).toContain('background-color: red')
      expect(element1.exists()).toBe(true)
      expect(element1.attributes('style')).toContain('background-color: red')
      expect(element2.exists()).toBe(true)
      expect(element2.attributes('style')).toContain('background-color: red')
    })

    it('renders filtered list items', () => {
      const wrapper = mount(VueTestComponent)
      const element0 = wrapper.find('#renders_filtered_list_items_0')
      const element1 = wrapper.find('#renders_filtered_list_items_1')
      
      expect(element0.exists()).toBe(true)
      expect(element0.classes()).toContain('active-item')
      expect(element1.exists()).toBe(true)
      expect(element1.classes()).toContain('active-item')
    })
  })

  describe('nested conditional rendering', () => {
    it('renders admin panel when logged in and admin', () => {
      const wrapper = mount(VueTestComponent, { props: { isLoggedIn: true, isAdmin: true } })
      const element = wrapper.find('#renders_admin_panel_when_logged_in_and_admin')
      expect(element.exists()).toBe(true)
      expect(element.classes()).toContain('admin-panel')
    })

    it('renders user panel when logged in but not admin', () => {
      const wrapper = mount(VueTestComponent, { props: { isLoggedIn: true, isAdmin: false } })
      const element = wrapper.find('#renders_user_panel_when_logged_in_but_not_admin')
      expect(element.exists()).toBe(true)
      expect(element.classes()).toContain('user-panel')
    })

    it('renders login form when not logged in', () => {
      const wrapper = mount(VueTestComponent, { props: { isLoggedIn: false } })
      const element = wrapper.find('#renders_login_form_when_not_logged_in')
      expect(element.exists()).toBe(true)
      expect(element.classes()).toContain('login-form')
    })
  })

  describe('combined class and style', () => {
    it('applies both class and style simultaneously', () => {
      const wrapper = mount(VueTestComponent)
      const element = wrapper.find('#applies_both_class_and_style_simultaneously')
      expect(element.classes()).toContain('btn-primary')
      const style = element.attributes('style')
      expect(style).toContain('color: red')
      expect(style).toContain('margin-top: 10px')
    })

    it('applies conditional class with existing style', () => {
      const wrapper = mount(VueTestComponent, { props: { isHighlighted: true } })
      const element = wrapper.find('#applies_conditional_class_with_existing_style_highlighted')
      expect(element.exists()).toBe(true)
      expect(element.classes()).toContain('highlighted-text')
    })

    it('applies multiple comments in conditional rendering', () => {
      const wrapper = mount(VueTestComponent, { props: { showDetails: true } })
      const element = wrapper.find('#applies_multiple_comments_in_conditional_rendering')
      expect(element.exists()).toBe(true)
      expect(element.classes()).toContain('detail-container')
      const style = element.attributes('style')
      expect(style).toContain('padding: 20px')
      expect(style).toContain('margin-top: 10px')
    })
  })

  describe('edge cases', () => {
    it('ignores empty comments', () => {
      const wrapper = mount(VueTestComponent)
      const element = wrapper.find('#ignores_empty_comments')
      expect(element.classes()).toContain('btn-primary')
    })

    it('renders elements without comments unchanged', () => {
      const wrapper = mount(VueTestComponent)
      const element = wrapper.find('#renders_elements_without_comments_unchanged')
      const spanElement = element.find('span')
      expect(spanElement.exists()).toBe(true)
      expect(spanElement.text()).toBe('Hello World')
      // 주석이 없으므로 span에는 class나 style이 추가되지 않아야 함
      expect(spanElement.classes().length).toBe(0)
    })

    it('handles array destructuring in each blocks', () => {
      const wrapper = mount(VueTestComponent)
      const element0 = wrapper.find('#handles_array_destructuring_in_each_blocks_0')
      const element1 = wrapper.find('#handles_array_destructuring_in_each_blocks_1')
      
      expect(element0.exists()).toBe(true)
      expect(element0.classes()).toContain('user-card')
      expect(element1.exists()).toBe(true)
      expect(element1.classes()).toContain('user-card')
    })
  })

  describe('nested structure', () => {
    it('applies class to nested elements', () => {
      const wrapper = mount(VueTestComponent)
      const headerElement = wrapper.find('#applies_class_to_nested_header')
      const mainElement = wrapper.find('#applies_class_to_nested_main')
      
      expect(headerElement.exists()).toBe(true)
      expect(headerElement.classes()).toContain('header-class')
      expect(mainElement.exists()).toBe(true)
      expect(mainElement.classes()).toContain('main-content')
    })
  })
})
