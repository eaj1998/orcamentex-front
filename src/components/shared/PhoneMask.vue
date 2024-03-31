<!-- PhoneMask.vue -->
<template>
    <div>
      <label for="phone">Phone Number:</label>
      <input type="text" id="phone" v-model="formattedPhoneNumber" v-mask="'(###) ###-####'">
    </div>
  </template>
  
  <script>
  import { ref, watch } from 'vue';
  import { mask } from 'vue-the-mask';
  
  export default {
    name: 'PhoneMask',
    props: {
      initialPhoneNumber: {
        type: String,
        default: ''
      }
    },
    emits: ['update:formattedPhoneNumber'],
  
    setup(props, { emit }) {
      const formattedPhoneNumber = ref(props.initialPhoneNumber);
  
      watch(formattedPhoneNumber, (newValue) => {
        emit('update:formattedPhoneNumber', newValue);
      });
  
      return {
        formattedPhoneNumber
      };
    },
    directives: {
      mask
    }
  };
  </script>
  