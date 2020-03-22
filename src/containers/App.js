import React, { Component } from "react";
import styled, { ThemeProvider } from "styled-components";
import axios from "axios";

import Header from "../components/Header";
import Media from "../components/Media";
import Card from "../components/Card";

import data from "../assets/data/tweets.json";

const theme = {
  colors: {
    dark: "#04090d",
    light: "#f8f8f8",
    primary: "#243243"
  },
  fonts: {
    display: "'Roboto', sans-serif",
    text: "'Roboto Mono', sans-serif"
  },
  pageWidth: {
    xl: 1200,
    l: 992,
    m: 768,
    s: 576
  },
  columns: {
    xl: 24,
    l: 19,
    m: 12,
    s: 9,
    gap: {
      xl: 5,
      l: 5,
      m: 5,
      s: 5
    }
  }
};

const Container = styled.div`
  position: relative;
  margin: 0 auto;
  padding: 0 30px;
  width: 100%;
  @media (min-width: ${theme.pageWidth.s}px) {
    max-width: ${theme.pageWidth.s}px;
  }
  @media (min-width: ${theme.pageWidth.m}px) {
    max-width: ${theme.pageWidth.m}px;
  }
  @media (min-width: ${theme.pageWidth.l}px) {
    max-width: ${theme.pageWidth.l}px;
  }
  @media (min-width: ${theme.pageWidth.xl}px) {
    max-width: ${theme.pageWidth.xl}px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: ${"----------------------------------------"
    .substring(0, theme.columns.s)
    .replace(/-/gi, "1fr ")};
  grid-column-gap: ${theme.columns.gap.s}px;
  grid-row-gap: ${2 * theme.columns.gap.s}px;
  margin: 30px 0;
  transform: rotate3d(0deg, 0deg, 0deg);

  @media (min-width: ${theme.pageWidth.s}px) {
    grid-template-columns: ${"----------------------------------------"
      .substring(0, theme.columns.s)
      .replace(/-/gi, "1fr ")};
    grid-column-gap: ${theme.columns.gap.s}px;
    grid-row-gap: ${2 * theme.columns.gap.s}px;
  }
  @media (min-width: ${theme.pageWidth.m}px) {
    grid-template-columns: ${"----------------------------------------"
      .substring(0, theme.columns.m)
      .replace(/-/gi, "1fr ")};
    grid-column-gap: ${theme.columns.gap.m}px;
    grid-row-gap: ${2 * theme.columns.gap.m}px;
  }
  @media (min-width: ${theme.pageWidth.l}px) {
    grid-template-columns: ${"----------------------------------------"
      .substring(0, theme.columns.l)
      .replace(/-/gi, "1fr ")};
    grid-column-gap: ${theme.columns.gap.l}px;
    grid-row-gap: ${2 * theme.columns.gap.l}px;
  }
  @media (min-width: ${theme.pageWidth.xl}px) {
    grid-template-columns: ${"----------------------------------------"
      .substring(0, theme.columns.xl)
      .replace(/-/gi, "1fr ")};
    grid-column-gap: ${theme.columns.gap.xl}px;
    grid-row-gap: ${2 * theme.columns.gap.xl}px;
  }
`;

const HeaderWrapper = styled.header`
  grid-column: 1 / span ${theme.columns.s};
  grid-row: 3 / span 5;
  justify-self: center;
  align-self: center;

  @media (min-width: ${theme.pageWidth.s}px) {
    grid-column: 1 / span ${theme.columns.s};
    grid-row: 2 / span 5;
  }
  @media (min-width: ${theme.pageWidth.m}px) {
    grid-column: 2 / span ${theme.columns.m - 2};
  }
  @media (min-width: ${theme.pageWidth.l}px) {
    grid-column: 3 / span ${theme.columns.l - 4};
  }
  @media (min-width: ${theme.pageWidth.xl}px) {
    grid-column: 3 / span ${theme.columns.xl - 4};
  }
`;

const Footer = styled.footer`
  position: fixed;
  bottom: 0;
  right: 0;
  padding: 0.25em 30px 0.25em;
  background: rgba(248, 248, 248, 0);
  background: -moz-linear-gradient(
    left,
    rgba(248, 248, 248, 0) 0%,
    rgba(248, 248, 248, 0.95) 25%,
    rgba(248, 248, 248, 1) 100%
  );
  background: -webkit-gradient(
    left top,
    right top,
    color-stop(0%, rgba(248, 248, 248, 0)),
    color-stop(25%, rgba(248, 248, 248, 0.95)),
    color-stop(100%, rgba(248, 248, 248, 1))
  );
  background: -webkit-linear-gradient(
    left,
    rgba(248, 248, 248, 0) 0%,
    rgba(248, 248, 248, 0.95) 25%,
    rgba(248, 248, 248, 1) 100%
  );
  background: -o-linear-gradient(
    left,
    rgba(248, 248, 248, 0) 0%,
    rgba(248, 248, 248, 0.95) 25%,
    rgba(248, 248, 248, 1) 100%
  );
  background: -ms-linear-gradient(
    left,
    rgba(248, 248, 248, 0) 0%,
    rgba(248, 248, 248, 0.95) 25%,
    rgba(248, 248, 248, 1) 100%
  );
  background: linear-gradient(
    to right,
    rgba(248, 248, 248, 0) 0%,
    rgba(248, 248, 248, 0.95) 25%,
    rgba(248, 248, 248, 1) 100%
  );
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#f8f8f8', endColorstr='#f8f8f8', GradientType=1 );
  text-align: right;
`;

const Link = styled.a`
  color: inherit;
  font-family: ${theme.fonts.display};
  text-decoration: none;
  font-size: 0.625rem;
  display: block;
`;

const Modal = styled.div`
  position: absolute;
  z-index: 2;
  animation: "in 400ms ease-out";
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 2;
  animation: in 500ms ease-in-out;
`;

class App extends Component {
  state = {
    loading: false,
    tweets: [],
    currentTweet: null,
    currentPage: 1
  };

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
    this.container = React.createRef();
    this.timer = null;
    this.fetchTweets();
  }

  fetchTweets() {
    // const { currentPage: _currentPage, tweets: _tweets } = this.state
    // const hostUrl = 'http://localhost:3333'
    // const endpoint = 'api/tweets'
    // const params = `page=${_currentPage}&perPage=50`
    // axios.get(`${hostUrl}/${endpoint}?${params}`)
    //   .then(res => {
    //     const { list: newTweets } = res.data
    //     const currentPage = _currentPage + 1
    //     const tweets = _tweets.concat(newTweets)
    //     this.setState({ tweets, currentPage })
    //   })
    let unique_id_data = data.tweetsList.map(tweet => {
      let tw = { ...tweet };
      tw.tweet_id_str += Math.random();
      return tw;
    });

    let tweets = [...this.state.tweets, ...unique_id_data];
    this.setState({ tweets });
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = e => {
    let scrollHeight = document.body.scrollHeight;
    let viewportHeight = window.innerHeight;
    let scrollTop = window.scrollY;

    if (scrollHeight - viewportHeight - scrollTop < 200) {
      this.fetchTweets();
    }
  };

  mouseEnterHandler = (e, tweet) => {
    let ct = { tweet, el: e.target };
    this.timer = setTimeout(() => {
      this.setState({ currentTweet: ct });
    }, 800);
  };

  mouseLeaveHandler = () => {
    clearTimeout(this.timer);
  };

  closeCard = () => {
    this.setState({ currentTweet: null });
  };

  render() {
    let gallery = this.state.tweets.map(tweet => {
      return (
        <Media
          key={tweet.tweet_id_str}
          tweet={tweet}
          alt=""
          enter={this.mouseEnterHandler}
          leave={this.mouseLeaveHandler}
        />
      );
    });

    let tweetCard = null;
    if (this.state.currentTweet) {
      let containerRect = this.container.current.getBoundingClientRect();
      let elemRect = this.state.currentTweet.el.getBoundingClientRect();
      let x =
        elemRect.left -
        containerRect.left +
        (elemRect.right - elemRect.left) / 2 -
        180;
      let y = elemRect.top - containerRect.top - 30;

      if (x + 360 > containerRect.right - containerRect.left + 15)
        x = containerRect.right - containerRect.left + 15 - 360;
      if (x < 15) x = 15;
      if (y < -25) y = -25;

      tweetCard = (
        <Modal style={{ top: y, left: x }}>
          <Overlay onTouchStart={this.closeCard} />
          <Card tweet={this.state.currentTweet.tweet} close={this.closeCard} />
        </Modal>
      );
    }

    return (
      <Container ref={this.container} className="App">
        <ThemeProvider theme={theme}>
          <Grid>
            <HeaderWrapper>
              <Header
                title="#PañuelosConMemoria"
                info="Este 24 de marzo construimos memoria activa desde Marcha Virtual."
              >
                Subí tu foto a Twitter con el hashtag{" "}
                <a
                  href="https://twitter.com/search?q=%23PañuelosConMemoria"
                  target="_blank"
                >
                  #PañuelosConMemoria
                </a>{" "}
                y sumate. <span>¡La marcha la hacemos entre todxs!</span>
              </Header>
            </HeaderWrapper>
            {gallery}
          </Grid>
          {tweetCard}
          <Footer>
            <img src="/favicon.ico" width="70px" alt="marcha-virtual"></img>
            <Link href="https://facttic.org.ar/" target="_blank">
              Desarrollado por FACTTIC
            </Link>
          </Footer>
        </ThemeProvider>
      </Container>
    );
  }
}

export default App;
