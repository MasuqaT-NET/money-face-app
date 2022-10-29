<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher<{ loaded: HTMLImageElement }>();

  type FileInputChangeEvent = Event & { currentTarget: HTMLInputElement };

  const handleChange = (e: FileInputChangeEvent) => {
    const reader = new FileReader();
    reader.onloadend = (e) => {
      const image = new Image();
      image.src = e.target.result.toString();
      image.onload = () => {
        dispatch("loaded", image);
      };
    };
    reader.readAsDataURL(e.currentTarget.files[0]);
  };
</script>

<fieldset>
  <label for="input">Upload</label>
  <input id="input" type="file" accept="image/*" on:change={handleChange} />
</fieldset>
