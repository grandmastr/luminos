<template>
  <MonkeyTag>
    <form @submit.prevent="handleSubmit">
      <Input placeholder=" " label="Monkey Tag" class="input" v-model="tag" />
      <transition name="fade">
        <template v-if="tagError">
          <div class="help-text__container">
            <i data-feather="info" />
            Your monkeytag must be 11 characters or less and contain only
            letter, numbers, and underscores and no spaces
          </div>
        </template>
      </transition>
      <Button :disabled="disabled"> Update Monkey Tag</Button>
    </form>
  </MonkeyTag>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import styled from 'vue-styled-components';
import { lighten } from 'polished';
import feather from 'feather-icons';

import { Button, Input } from '@/components';
import { isTagValid } from '@/helpers';

const MonkeyTag = styled('article')`
   {
    padding: 22px 0;

    div.help-text__container {
      margin-bottom: 32px;
      padding: 1em;
      border-radius: 8px;
      border: 1.5px solid ${({ theme }) => lighten(0.1, theme.colors.disabled)};

      font-size: 0.8em;
      line-height: 20px;
      display: flex;

      svg {
        stroke: ${({ theme }) => theme.colors.orange};
        margin-right: 12px;
        align-self: center;
      }

      color: ${lighten(0.4, '#000000')};
    }

    .input {
      input {
        text-transform: lowercase;
        margin-bottom: 24px;
      }
    }
  }
`;

export default {
  components: {
    MonkeyTag,
    Button,
    Input,
  },
  data() {
    return {
      tag: '',
      processing: false,
    };
  },
  methods: {
    async handleSubmit() {
      this.processing = true;
      try {
        const data = await this.updateUser({
          swap_tag: `@${this.tag.toLowerCase()}`,
        });

        if (data?.success) {
          this.$emit('closeMonkeyTag');
        }
      } finally {
        this.processing = false;
      }
    },
    ...mapActions('user', ['updateUser']),
  },
  computed: {
    disabled() {
      return !isTagValid(`@${this.tag.toLowerCase()}`) || this.processing;
    },
    tagError() {
      return (
        !!this.tag &&
        this.tag.toLowerCase() !== 'monkeyprince' &&
        !isTagValid(`@${this.tag.toLowerCase()}`)
      );
    },
    ...mapGetters('user', ['user']),
  },
  mounted() {
    this.tag = this.user.swap_tag.substr(1) || '';

    feather.replace({
      height: '36px',
      width: '36px',
    });
  },
};
</script>
