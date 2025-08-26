<script>
  export let name;
  export let theme;
  export let features;
  const featureIcon = '👉';
</script>

<div> <!-- text-center flex items-center justify-center -->
  <div>
    <header> <!-- bg-white p-8 min-w-lg rounded-3xl shadow-2xl -->
      <p>{name}</p> <!-- {theme} text-white text-4xl font-bold py-2 rounded-lg leading-snug -->
      <div> <!-- my-8 -->
        <h2>Key Features:</h2> <!-- text-2xl font-bold text-slate-700 mb-6 -->
        <ul> <!-- text-left px-8 --> <!-- bg-gray-100 px-4 py-2 mb-5 rounded-lg -->
          {#each features as feature, index}
            <li> <!-- text-lg py-1 max-w-[270px] mx-auto -->
              <span>{featureIcon}</span><!-- mr-2 --> {feature}
            </li>
          {/each}
        </ul>
      </div>
      <h2>Example:</h2> <!-- text-2xl font-bold text-slate-700 mb-6 -->
      <div> <!-- bg-gray-100 px-4 py-2 mb-5 rounded-lg -->
        <p>{`<!-- color:white; -->`}</p> <!-- {theme} --> <!-- color:white; -->
        <p>style="color:white;"</p> <!-- mb-5 -->
        <p>{`<!-- text-white -->`}</p> <!-- {theme} text-white -->
        <p>class="text-white"</p> <!-- mb-5 -->
        <p>{`<!-- // double-slash for a comment -->`}</p> <!-- {theme} text-white -->
        <p>{`<!-- double-slash for a comment -->`}</p> <!-- // double-slash for a comment -->
      </div>
    </header>
  </div>
</div>

<style>
  
</style>
