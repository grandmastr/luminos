<template>
  <Terms>
    <SignUpHead>
      <template #head>Terms and Conditions</template>
    </SignUpHead>
    <p class="terms">
      Lorem Ipsum is simply dummy text of the printing and typesetting industry.
      Lorem Ipsum has been the industry's standard dummy text ever since the
      1500s, when an unknown printer took a galley of type and scrambled it to
      make a type specimen book. It has survived not only five centuries, but
      also the leap into electronic typesetting, remaining essentially
      unchanged. It was popularised in the 1960s with the release of Letraset
      sheets containing Lorem Ipsum passages, and more recently with desktop
      publishing software like Aldus PageMaker including versions of Lorem
      Ipsum.
      <br />
      <br />
      Why do we use it?
      <br />
      It is a long established fact that a reader will be distracted by the
      readable content of a page when looking at its layout be distracted
    </p>
    <div class="flex">
      <SelectionControl
        name="terms"
        type="radio"
        index="0"
        :value="true"
        @change="setValue"
      />
      <p>I consent to the above Terms & Conditions</p>
    </div>

    <Button
      text="Next"
      :disabled="!checked"
      @click="$router.push('./step-5')"
      styles="margin-top: 20.49px"
    ></Button>
  </Terms>
</template>

<script>
import signUpMixin from '@/views/auth/SignUp/signUpMixin';
import styled from 'vue-styled-components';
import { SelectionControl } from '@/components';

const Terms = styled.p`
  .terms {
    font-size: 14px;
    line-height: 160%;
    color: ${({ theme }) => theme.colors.text.light};
    margin: 37px 0 52px 0;
  }

  .flex {
    display: flex;
    align-items: center;

    p {
      margin: 0 0 0 7.74px;
      font-size: 14px;
      line-height: 14px;
      letter-spacing: 0.16px;
    }
  }
`;

export default {
  name: 'TermsAndConditions',
  mixins: [signUpMixin],
  components: {
    SelectionControl,
    Terms,
  },
  data() {
    return {
      checked: false,
    };
  },
  methods: {
    setValue(value) {
      this.checked = value;
      this.setSignUpDetails({ checked: this.checked });
    },
  },
};
</script>

<style scoped>
.mb-5 {
  margin-bottom: 44px;
}
</style>
