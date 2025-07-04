<!-- Modal.svelte -->
<script>
    export let isOpen = false;
    export let close = () => {};
  </script>
  
  {#if isOpen}
    <div class="modal-backdrop" on:click={close}></div>
    <div class="modal">
      <div class="modal-content">
        <button class="close-button" on:click={close}>×</button>
        <slot></slot>
      </div>
    </div>
  {/if}
  
  <style>
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 1000;
    }
    .modal {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      padding: 1rem;
      border-radius: 8px;
      z-index: 1001;
    }
    .modal-content {
      position: relative;
    }
    .close-button {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
    }
  </style>