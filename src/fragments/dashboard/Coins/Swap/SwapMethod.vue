<template>
  <article>
    <Check
      v-for="(method, index) in methods"
      :key="method.name"
      :class="{ active: method.name === chosenMethod }"
    >
      <div class="heading">
        <h4 class="title">{{ method.name }}</h4>
        <SelectionControl
          @change="chosenMethod = method.name"
          :index="index + 1"
          name="swap-method"
          :value="method.name"
        />
      </div>
      <p>{{ method.description }}</p>
    </Check>
    <ButtonWrapper>
      <Back @click="$emit('goBack')" />
      <Button @click="$emit('finish')" text="Finish" :disabled="processing" />
    </ButtonWrapper>
  </article>
</template>

<script>
import styled from 'vue-styled-components';

import { Button, SelectionControl } from '@/components';
import { Back } from '@/assets';

const ButtonWrapper = styled.div`
   {
    display: grid;
    grid-template-columns: 32px 1fr;
    gap: 20px;
    align-items: center;

    svg {
      cursor: pointer;
    }
  }
`;

const Check = styled.div`
   {
    border: 1.5px solid ${({ theme }) => theme.colors.text.secondary.lighter};
    border-radius: 8px;
    padding: 24px;
    margin-bottom: 24px;

    &.active {
      border-color: ${({ theme }) => theme.colors.orange};
    }

    .heading {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12.49px;

      .title {
        color: ${({ theme }) => theme.colors.orange};
        margin: 0;
      }
    }

    p {
      margin: 0;
      font-size: 14px;
      line-height: 20px;
    }
  }
`;

export default {
  name: 'SwapType',
  components: {
    Check,
    SelectionControl,
    Back,
    ButtonWrapper,
    Button,
  },
  props: ['processing'],
  data() {
    return {
      chosenMethod: '',
      methods: [
        {
          name: 'Instant swap',
          description:
            'Lorem ipsum dolor sit amet, di os consectetur adipiscing elit, sed do eiusmod tempor incididunt ut fsil labore et dolore magna aliqua.',
        },
        {
          name: 'Manual swap',
          description:
            'Lorem ipsum dolor sit amet, di os consectetur adipiscing elit, sed do eiusmod tempor incididunt ut fsil labore et dolore magna aliqua.',
        },
      ],
    };
  },
};
</script>
