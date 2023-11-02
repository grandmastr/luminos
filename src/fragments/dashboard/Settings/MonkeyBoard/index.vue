<template>
  <styled-article>
    <template v-if="monkeyboard.fetching">
      <div class="spinner-container">
        <spinner />
      </div>
    </template>
    <template v-else>
      <template v-if="monkeyboard.results.length">
        <ItemList>
          <Item v-for="(n, index) in monkeyboard.results" :key="n.swap_tag">
            <div class="image-wrapper">
              <img
                v-if="index + 1 <= 3"
                :src="
                  index + 1 <= 3
                    ? require(`@/assets/stars/${index + 1}.png`)
                    : null
                "
                class="star"
                alt=""
              />
              <div class="image-circle">
                <img
                  :src="
                    require(`@/assets/avatars/${((index + 1) % 20) + 1}.webp`)
                  "
                  alt=""
                />
              </div>
            </div>

            <p class="username">
              {{ n.swap_tag === user.swap_tag ? 'You' : n.swap_tag }}
            </p>
            <p class="points">{{ 10 * n.completed_swaps }}pts</p>
            <p class="position">{{ n.position | positions }}</p>
          </Item>
        </ItemList>
        <!--        <Footer>-->
        <!--          <Item>-->
        <!--            <div class="image-wrapper">-->
        <!--              <div class="image-circle">-->
        <!--                <img src="@/assets/avatars/2.webp" alt="" />-->
        <!--              </div>-->
        <!--            </div>-->
        <!--            <p class="username">You</p>-->
        <!--            <p class="points">3,456 pts</p>-->
        <!--            <p class="position">27th</p>-->
        <!--          </Item>-->
        <!--        </Footer>-->
      </template>
      <template v-else>
        <styled-empty title="You have 0 points">
          You do not have any points at the moment, but you can perform swaps to
          climb up the monkeyboard
        </styled-empty>
      </template>
    </template>
  </styled-article>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import styled from 'vue-styled-components';

import { Empty, Spinner } from '@/components';

const StyledArticle = styled('article')`
  div.spinner-container {
    height: calc(500px);
    display: grid;
    place-items: center;
  }
`;

const StyledEmpty = styled(Empty)`
  display: grid;

  > div {
    position: relative;
    top: -24px;
  }
`;

const ItemList = styled('ul')`
   {
    max-height: calc(500px - 67.2px);
    overflow-y: auto;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      width: 0;
      background: transparent;
      display: none;
    }
  }
`;

const Item = styled('li')`
   {
    padding: 8px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;

    .image-wrapper {
      display: flex;
      align-items: center;

      .star {
        width: 13px;
        height: 13px;
        position: absolute;
      }
    }

    .image-circle {
      width: 47px;
      height: 47px;
      background: #f6f7ff;
      border-radius: 50%;
      display: grid;
      place-items: center;
      padding: 8px;
      margin-left: 25px;
    }

    .username {
      margin: 0;
      font-size: 0.8rem;
      width: 120px;
      text-align: left;
      font-weight: 600;
      line-height: 14px;
      color: ${({ theme }) => theme.colors.ongoing};
    }

    .points {
      margin: 0;
      font-size: 0.8rem;
      font-weight: bold;
      width: 60px;
      text-align: right;
      line-height: 18.45px;
      color: ${({ theme }) => theme.colors.text.secondary.light};
    }

    .position {
      margin: 0;
      font-size: 0.8rem;
      font-weight: 500;
      color: ${({ theme }) => theme.colors.text.secondary.main};
    }
  }
`;

const Footer = styled('footer')`
   {
    position: absolute;
    width: 100%;
    background: #ffffff;
    box-shadow: 0 4px 22px 5px rgba(0, 0, 0, 0.05);
    border-radius: 0 0 16px 16px;
    left: 0;
    bottom: 0;
    padding: 1.3rem;

    li {
      padding: 0;
    }
  }
`;

export default {
  components: {
    Item,
    // eslint-disable-next-line vue/no-unused-components
    Footer,
    ItemList,
    Spinner,
    StyledArticle,
    StyledEmpty,
  },
  methods: {
    ...mapActions('monkeyboard', ['getMonkeyboard']),
  },
  computed: {
    ...mapGetters('monkeyboard', ['monkeyboard']),
    ...mapGetters('user', ['user']),
  },
};
</script>
