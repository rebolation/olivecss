<script>
  export let name = "Svelte";
  export let isActive = false;
  export let isVisible = true;
  export let isError = false;
  export let isHighlighted = false;
  export let isLoggedIn = false;
  export let isAdmin = false;
  export let showDetails = false;
  
  // Test data
  const items = [
    { id: 1, name: 'Item 1', active: true },
    { id: 2, name: 'Item 2', active: false },
    { id: 3, name: 'Item 3', active: true }
  ];
  
  const colors = ['red', 'blue', 'green'];
  const users = [
    { id: 1, name: 'John', role: 'admin' },
    { id: 2, name: 'Jane', role: 'user' }
  ];
</script>

<main>
  <h1>Hello {name}!</h1>
  
  <!-- // 기본 class 변환 테스트 -->
  <div id="transforms_class_comments_to_class_attribute">
    <!-- btn-primary -->
  </div>
  
  <!-- // 기본 style 변환 테스트 -->
  <div id="transforms_style_comments_to_style_attribute">
    <!-- color: red; margin-top: 10px; -->
  </div>
  
  <!-- // 기존 class와 병합 -->
  <div id="merges_with_existing_class" class="existing-class">
    <!-- btn-primary -->
  </div>
  
  <!-- // 기존 style과 병합 -->
  <div id="merges_with_existing_style" style="font-size: 16px;">
    <!-- color: red; margin-top: 10px; -->
  </div>
  
  <!-- // 여러 class 주석 -->
  <div id="merges_multiple_class_comments">
    <!-- btn-primary -->
    <!-- text-center -->
    <!-- mt-4 -->
  </div>
  
  <!-- // 여러 style 주석 -->
  <div id="merges_multiple_style_comments">
    <!-- color: red; -->
    <!-- margin-top: 10px; -->
    <!-- padding: 20px; -->
  </div>
  
  <!-- // class와 style 동시 처리 -->
  <div id="applies_both_class_and_style_simultaneously">
    <!-- btn-primary -->
    <!-- color: red; margin-top: 10px; -->
  </div>
  
  <!-- // 중첩된 구조 -->
  <div id="nested_structure_container">
    <header id="applies_class_to_nested_header">
      <!-- header-class -->
    </header>
    <main id="applies_class_to_nested_main">
      <!-- main-content -->
    </main>
  </div>
  
  <!-- // 복잡한 style 속성 -->
  <div id="handles_complex_style_properties">
    <!-- background-color: #f0f0f0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); -->
  </div>
  
  <!-- // 조건부 렌더링 with class -->
  {#if isVisible}
    <div id="renders_conditional_content_with_class_when_condition_is_true">
      <!-- visible-content -->
    </div>
  {/if}
  
  <!-- // 조건부 렌더링 with style -->
  {#if isError}
    <div id="renders_conditional_content_with_style_when_condition_is_true">
      <!-- color: red; background-color: #fee; -->
    </div>
  {/if}
  
  <!-- // 삼항 연산자 with class -->
  {#if isActive}
    <div id="renders_active_state_when_isActive_is_true">
      <!-- active-state -->
    </div>
  {:else}
    <div id="renders_inactive_state_when_isActive_is_false">
      <!-- inactive-state -->
    </div>
  {/if}
  
  <!-- // map 함수 with class -->
  {#each items as item, index}
    <div id="renders_list_items_with_class_{index}">
      <!-- list-item -->
    </div>
  {/each}
  
  <!-- // map 함수 with style -->
  {#each colors as color, index}
    <div id="renders_list_items_with_style_{index}">
      <!-- background-color: red; -->
    </div>
  {/each}
  
  <!-- // filter와 map 조합 -->
  {#each items.filter(item => item.active) as item, index}
    <div id="renders_filtered_list_items_{index}">
      <!-- active-item -->
    </div>
  {/each}
  
  <!-- // 중첩된 조건부 렌더링 -->
  {#if isLoggedIn}
    <div id="nested_conditional_rendering_container">
      {#if isAdmin}
        <div id="renders_admin_panel_when_logged_in_and_admin">
          <!-- admin-panel -->
        </div>
      {:else}
        <div id="renders_user_panel_when_logged_in_but_not_admin">
          <!-- user-panel -->
        </div>
      {/if}
    </div>
  {:else}
    <div id="renders_login_form_when_not_logged_in">
      <!-- login-form -->
    </div>
  {/if}
  
  <!-- // 조건부 class with 기존 style -->
  <div id="applies_conditional_class_with_existing_style_container" style="font-size: 16px;">
    {#if isHighlighted}
      <div id="applies_conditional_class_with_existing_style_highlighted">
        <!-- highlighted-text -->
      </div>
    {:else}
      <div id="applies_conditional_class_with_existing_style_normal">
        <!-- normal-text -->
      </div>
    {/if}
  </div>
  
  <!-- // 배열 구조분해 in map -->
  {#each users as { id, name, role }, index}
    <div id="handles_array_destructuring_in_each_blocks_{index}">
      <!-- user-card -->
    </div>
  {/each}
  
  <!-- // 조건부 렌더링 with 여러 주석 -->
  {#if showDetails}
    <div id="applies_multiple_comments_in_conditional_rendering">
      <!-- detail-container -->
      <!-- padding: 20px; margin-top: 10px; -->
    </div>
  {/if}
  
  <!-- // 빈 주석 무시 -->
  <div id="ignores_empty_comments" class="btn-primary">
    <!-- -->
    <!-- btn-primary -->
    <!--   -->
  </div>
  
  <!-- // 주석이 없을 때 변환 없음 -->
  <div id="renders_elements_without_comments_unchanged">
    <span>Hello World</span>
  </div>
</main>

<style>
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
    color: #ff3e00; /* Svelte 오렌지 */
  }
  div {
    padding: 5px;
    border: 1px solid #ccc;
    margin: 2px;
  }
</style>
