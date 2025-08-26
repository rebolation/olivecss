<template>
  <div> <!-- text-center flex items-center justify-center -->
    <div>
      <header> <!-- bg-white p-8 min-w-lg rounded-3xl shadow-2xl -->
        <p :class="theme">{{ name }}</p>  <!-- text-white text-4xl font-bold py-2 rounded-lg leading-snug -->
        <div> <!-- my-8 -->
          <h2>Key Features:</h2> <!-- text-2xl font-bold text-slate-700 mb-6 -->
          <ul> <!-- text-left px-8 --> <!-- bg-gray-100 px-4 py-2 mb-5 rounded-lg -->
            <li v-for="(feature, index) in features" :key="index"> <!-- text-lg py-1  max-w-[270px] mx-auto -->
              <span>{{ featureIcon }}</span> <!-- mr-2 --> {{ feature }}
            </li>
          </ul>
        </div>
        <h2>Example:</h2> <!-- text-2xl font-bold text-slate-700 mb-6 -->
        <div> <!-- bg-gray-100 px-4 py-2 mb-5 rounded-lg -->
          <p :class="theme">{{ `&lt;!-- color:white; --&gt;` }}</p> <!-- color:white; -->
          <p>style="color:white;"</p> <!-- mb-5 -->
          <p :class="theme">{{ `&lt;!-- text-white --&gt;` }}</p> <!-- text-white-->
          <p>class="text-white"</p> <!-- mb-5 -->
          <p :class="theme">{{ `&lt;!-- // double-slash for a comment --&gt;` }}</p> <!-- text-white -->
          <p>{{ `&lt;!-- double-slash for a comment --&gt;` }}</p> <!-- // double-slash for a comment -->
        </div>
      </header>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AstroVue',
  props: { name: String, theme: String, features: Array },
  data() {
    return {
      featureIcon: '👉',
    }
  }
}
</script>
