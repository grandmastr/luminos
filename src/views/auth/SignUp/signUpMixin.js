import { Button, Input } from '@/components';
import { SignUpHead } from '@/fragments';
import { mapActions, mapGetters, mapMutations } from 'vuex';

export default {
  name: 'VerifyEmail',
  components: {
    SignUpHead,
    Input,
    Button,
  },
  computed: mapGetters('user', ['signUpDetails']),
  methods: {
    ...mapMutations('user', ['setSignUpDetails']),
    ...mapActions('user', ['syncUserData', 'syncToken']),
  },
};
