<template>
  <main>
    <h1>Hello {{ name }}!</h1>
    
    <!-- 기본 class 변환 테스트 -->
    <div id="transforms_class_comments_to_class_attribute" class="btn-primary">
      <!-- btn-primary -->
    </div>
    
    <!-- 기본 style 변환 테스트 -->
    <div id="transforms_style_comments_to_style_attribute" style="color: red; margin-top: 10px;">
      <!-- color: red; margin-top: 10px; -->
    </div>
    
    <!-- 기존 class와 병합 -->
    <div id="merges_with_existing_class" class="existing-class btn-primary">
      <!-- btn-primary -->
    </div>
    
    <!-- 기존 style과 병합 -->
    <div id="merges_with_existing_style" style="font-size: 16px; color: red; margin-top: 10px;">
      <!-- color: red; margin-top: 10px; -->
    </div>
    
    <!-- 여러 class 주석 -->
    <div id="merges_multiple_class_comments" class="btn-primary text-center mt-4">
      <!-- btn-primary -->
      <!-- text-center -->
      <!-- mt-4 -->
    </div>
    
    <!-- 여러 style 주석 -->
    <div id="merges_multiple_style_comments" style="color: red; margin-top: 10px; padding: 20px;">
      <!-- color: red; -->
      <!-- margin-top: 10px; -->
      <!-- padding: 20px; -->
    </div>
    
    <!-- class와 style 동시 처리 -->
    <div id="applies_both_class_and_style_simultaneously" class="btn-primary" style="color: red; margin-top: 10px;">
      <!-- btn-primary -->
      <!-- color: red; margin-top: 10px; -->
    </div>
    
    <!-- 중첩된 구조 -->
    <div id="nested_structure_container">
      <header id="applies_class_to_nested_header" class="header-class">
        <!-- header-class -->
      </header>
      <main id="applies_class_to_nested_main" class="main-content">
        <!-- main-content -->
      </main>
    </div>
    
    <!-- 복잡한 style 속성 -->
    <div id="handles_complex_style_properties" style="background-color: #f0f0f0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <!-- background-color: #f0f0f0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); -->
    </div>
    
    <!-- 조건부 렌더링 with class -->
    <div v-if="isVisible" id="renders_conditional_content_with_class_when_condition_is_true" class="visible-content">
      <!-- visible-content -->
    </div>
    
    <!-- 조건부 렌더링 with style -->
    <div v-if="isError" id="renders_conditional_content_with_style_when_condition_is_true" style="color: red; background-color: #fee;">
      <!-- color: red; background-color: #fee; -->
    </div>
    
    <!-- 삼항 연산자 with class -->
    <div v-if="isActive" id="renders_active_state_when_isActive_is_true" class="active-state">
      <!-- active-state -->
    </div>
    <div v-else id="renders_inactive_state_when_isActive_is_false" class="inactive-state">
      <!-- inactive-state -->
    </div>
    
    <!-- map 함수 with class -->
    <div v-for="(item, index) in items" :key="item.id" :id="`renders_list_items_with_class_${index}`" class="list-item">
      <!-- list-item -->
    </div>
    
    <!-- map 함수 with style -->
    <div v-for="(color, index) in colors" :key="index" :id="`renders_list_items_with_style_${index}`" style="background-color: red;">
      <!-- background-color: red; -->
    </div>
    
    <!-- filter와 map 조합 -->
    <div v-for="(item, index) in filteredItems" :key="item.id" :id="`renders_filtered_list_items_${index}`" class="active-item">
      <!-- active-item -->
    </div>
    
    <!-- 중첩된 조건부 렌더링 -->
    <div v-if="isLoggedIn" id="nested_conditional_rendering_container">
      <div v-if="isAdmin" id="renders_admin_panel_when_logged_in_and_admin" class="admin-panel">
        <!-- admin-panel -->
      </div>
      <div v-else id="renders_user_panel_when_logged_in_but_not_admin" class="user-panel">
        <!-- user-panel -->
      </div>
    </div>
    <div v-else id="renders_login_form_when_not_logged_in" class="login-form">
      <!-- login-form -->
    </div>
    
    <!-- 조건부 class with 기존 style -->
    <div id="applies_conditional_class_with_existing_style_container" style="font-size: 16px;">
      <div v-if="isHighlighted" id="applies_conditional_class_with_existing_style_highlighted" class="highlighted-text">
        <!-- highlighted-text -->
      </div>
      <div v-else id="applies_conditional_class_with_existing_style_normal" class="normal-text">
        <!-- normal-text -->
      </div>
    </div>
    
    <!-- 배열 구조분해 in map -->
    <div v-for="(user, index) in users" :key="user.id" :id="`handles_array_destructuring_in_each_blocks_${index}`" class="user-card">
      <!-- user-card -->
    </div>
    
    <!-- 조건부 렌더링 with 여러 주석 -->
    <div v-if="showDetails" id="applies_multiple_comments_in_conditional_rendering" class="detail-container" style="padding: 20px; margin-top: 10px;">
      <!-- detail-container -->
      <!-- padding: 20px; margin-top: 10px; -->
    </div>
    
    <!-- 빈 주석 무시 -->
    <div id="ignores_empty_comments" class="btn-primary">
      <!-- -->
      <!-- btn-primary -->
      <!--   -->
    </div>
    
    <!-- 주석이 없을 때 변환 없음 -->
    <div id="renders_elements_without_comments_unchanged">
      <span>Hello World</span>
    </div>
  </main>
</template>

<script>
export default {
  name: 'VueTestComponent',
  props: {
    name: {
      type: String,
      default: 'Vue'
    },
    isActive: {
      type: Boolean,
      default: false
    },
    isVisible: {
      type: Boolean,
      default: true
    },
    isError: {
      type: Boolean,
      default: false
    },
    isHighlighted: {
      type: Boolean,
      default: false
    },
    isLoggedIn: {
      type: Boolean,
      default: false
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    showDetails: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // Test data
      items: [
        { id: 1, name: 'Item 1', active: true },
        { id: 2, name: 'Item 2', active: false },
        { id: 3, name: 'Item 3', active: true }
      ],
      colors: ['red', 'blue', 'green'],
      users: [
        { id: 1, name: 'John', role: 'admin' },
        { id: 2, name: 'Jane', role: 'user' }
      ]
    }
  },
  computed: {
    filteredItems() {
      return this.items.filter(item => item.active)
    }
  }
}
</script>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-family: system-ui, sans-serif;
  gap: 10px;
}
h1 {
  font-size: 2rem;
  color: #42b883; /* Vue 그린 */
}
div {
  padding: 5px;
  border: 1px solid #ccc;
  margin: 2px;
}
</style>
