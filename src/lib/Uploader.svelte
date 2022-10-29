<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher<{ loaded: Image }>();

  type FileInputChangeEvent = Event & { currentTarget: HTMLInputElement };

  const handleChange = (e: FileInputChangeEvent) => {
    const reader = new FileReader();
    reader.onloadend = (e) => {
      const image = new Image();
      image.onload = () => {
        dispatch("loaded", image);
      };
      image.src = e.target.result.toString();
    };
    reader.readAsDataURL(e.currentTarget.files[0]);
  };
</script>

<fieldset>
  <label for="input">Upload</label>
  <input id="input" type="file" accept="image/*" on:change={handleChange} />
</fieldset>
