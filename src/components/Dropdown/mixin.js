import feather from 'feather-icons';

export default {
  props: {
    value: [Number, String],
    visible: Boolean,
    type: {
      type: String,
      default() {
        return 'text';
      },
    },
    disabled: {
      type: Boolean,
      required: false,
      default() {
        return false;
      },
    },
    label: {
      type: String,
      required: true,
    },
    message: String,
    instruction: String,
    initial: {
      type: [String, Number],
      default() {
        return 0;
      },
    },
  },
  data() {
    return {
      active: 0,
      activeInput: false,
      open: false,
      listItems: null,
    };
  },
  computed: {
    firstFocusableEl() {
      return this.listItems?.[0];
    },
    lastFocusableEl() {
      return this.listItems?.[this.listItems.length - 1];
    },
  },
  watch: {
    active(value) {
      this.chooseActive(value);
    },
  },
  methods: {
    chooseActive(index) {
      if (index) {
        this.open = false;
      } else {
        if (typeof this.initial === 'string') {
          index = this.list.findIndex(
            item => item.name.toString() === this.initial.toString(),
          );
        } else {
          index = this.initial;
        }
      }
      this.active = index;
      this.$emit('change', this.list[index]);
    },
    handleKeyDown(event) {
      if (!this.open) {
        return;
      }

      const UP_CODE = 38;
      const DOWN_CODE = 40;
      const ESC_CODE = 27;

      const currentIndex = Array.from(this.listItems).indexOf(
        document.activeElement,
      );

      const goUp = () => {
        event.preventDefault();
        if (document.activeElement.isSameNode(this.firstFocusableEl)) {
          this.lastFocusableEl.focus();
        } else {
          this.listItems[currentIndex - 1].focus();
        }
      };

      const goDown = () => {
        event.preventDefault();
        if (document.activeElement.isSameNode(this.lastFocusableEl)) {
          this.firstFocusableEl.focus();
        } else {
          this.listItems[currentIndex + 1].focus();
        }
      };

      switch (event.keyCode) {
        case UP_CODE:
          goUp();
          break;
        case DOWN_CODE:
          goDown();
          break;
        case ESC_CODE:
          this.open = false;
      }
    },
    openList(event) {
      if (this.open) {
        this.open = false;
      } else {
        this.open = true;
        this.listItems = this.$el?.querySelectorAll(
          '.list .list-item.unactive',
        );
        this.$nextTick(() => this.firstFocusableEl.focus());
      }
    },
    handleOutsideClick(event) {
      if (!this.$el.contains(event.target)) {
        this.open = false;
      }
    },
  },
  mounted() {
    this.chooseActive();
    feather.replace({
      width: '16px',
      height: '16px',
    });
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('click', this.handleOutsideClick);
    document.addEventListener('focus', this.handleOutsideClick);
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('click', this.handleOutsideClick);
    document.removeEventListener('focus', this.handleOutsideClick);
  },
};
