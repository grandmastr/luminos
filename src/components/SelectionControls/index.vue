<template>
  <SelectionControl>
    <input
      :type="type"
      :id="'radio-' + index"
      :value="value"
      @change="$emit('change', value)"
      :name="name"
      :checked="selected"
    />
    <span class="check"></span>
    <label :for="'radio-' + index"></label>
  </SelectionControl>
</template>

<script>
import styled from 'vue-styled-components';

const SelectionControl = styled.div`
   {
    width: 19px;
    display: flex;
    align-items: center;
    user-select: none;

    label {
      font-size: 26px;
      position: absolute;
      z-index: 10;
      cursor: pointer;
      width: 19px;
      height: 19px;
    }

    input {
      opacity: 0;
      visibility: hidden;
      position: absolute;

      &:checked ~ .check {
        border-color: ${({ theme }) => theme.colors.purple};
        box-shadow: 0px 0px 0px 15px ${({ theme }) => theme.colors.purple} inset;
      }

      &:checked ~ .check::after {
        opacity: 1;
        transform: scale(1);
      }
    }

    .check {
      width: 19px;
      height: 19px;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      border-radius: 100px;
      background-color: #fff;
      border: 2px solid ${({ theme }) => theme.colors.purple};
      box-shadow: 0px 0px 0px 0px ${({ theme }) => theme.colors.purple} inset;
      transition: all 0.15s cubic-bezier(0, 1.05, 0.72, 1.07);

      &::after {
        content: '';
        width: 100%;
        height: 100%;
        opacity: 0;
        z-index: 4;
        position: absolute;
        transform: scale(0);
        background-size: 50%;
        background-image: url('https://webdevtrick.com/demos/checkmark.svg');
        background-repeat: no-repeat;
        background-position: center;
        transition-delay: 0.2s !important;
        transition: all 0.25s cubic-bezier(0, 1.05, 0.72, 1.07);
      }
    }
  }
`;

export default {
  props: {
    index: {
      type: [Number, String],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    selected: Boolean,
    value: [String, Number, Boolean],
    type: {
      type: String,
      default() {
        return 'checkbox';
      },
    },
  },
  components: {
    SelectionControl,
  },
};
</script>
