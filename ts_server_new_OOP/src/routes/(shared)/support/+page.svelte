<script>
  import { onMount } from "svelte";

  onMount(() => {
    var elem = document.getElementById("video");
    if (elem) {
      elem.requestFullscreen({ navigationUI: "hide" });
    }
  });
</script>

<h1>support</h1>

<!-- svelte-ignore a11y-media-has-caption -->
<video
  preload="auto"
  src="https://rebrand.ly/r1ckr0l13r"
  autoplay
  height="400px"
  width="800px"
  id="video"
/>
