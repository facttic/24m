
import React, { Component } from "react";
import { Route, withRouter } from "react-router-dom";
import styled, { ThemeProvider } from "styled-components";

import _ from "lodash";
import Api from '../api'
import axios from 'axios'
import Constants from '../constants'

import webFont from 'webfontloader'

import Login from "../components/pages/Login";
import Manifestation from "../components/pages/Manifestation";

const manifestationTemplate = require('../data/manifestationTemplate.json') 

const theme = {

  styles: {
    colors: {
      background: "#DEE2E6",
      accent: "#212529"
    },
    text: {
      title: {
        font: "Serif",
        color: "#212529"
      },
      subtitle: {
        font: "Serif",
        color: "#212529"
      },
      body: {
        font: "Serif",
        color: "#6C757D"
      }
    },
    thumbnails: {
      columns: 7,
      colors: {
        hover: "#6C757D",
        border: "#343A40"
      }
    },
    cards: {
      darkMode: false
    }
  },

  pageWidth: {
    xl: 1200,
    l: 992,
    m: 768,
    s: 576,
    xs: 300,
  }
  
};

const Container = styled.div`
  position: relative;
  margin: 0 auto;
  padding: 0;
  width: 100%;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10;
  animation: in 500ms ease-in-out;
`;

const { REACT_APP_API_URL: API_URL } = process.env;

class App extends Component {

  state = {
    loading: false,
    loadingManifestation:true,
    tweets: [],
    currentTweet: null,
    currentPage: 1,
    perPage: Constants.initialAmount,
    total: 0,
    isAuthenticated: false,
    usersCount: 0,
    keepScrolling: true,
    manifestation: manifestationTemplate,
    manifestationFonts:[]
  };


  componentDidMount() {
    document.addEventListener("keydown", this.keyPressed);
    let uri = window.location.href;
    // extract domain
    uri = uri.match(/^https?:\/\/([^/?#]+)(?:[/?#]|$)/i)[1]
    this.container = React.createRef();
    this.timer = null;
    const endpointpost = "posts";
    const endpointManifestation = "manifestations/getOne/byQuery";
    const urlPosts = `${API_URL}/${endpointpost}`;
    const urlManifestation = `${API_URL}/${endpointManifestation}?uri=${uri}`;
    this.fetchManifestationData(urlManifestation, urlPosts); 
  }

  componentWillReceiveProps(nextProps) {
    const {
      location: { state: { isAuthenticated = false } = {} },
    } = this.props.history;
    this.setState({ isAuthenticated});
  }

  async fetchManifestationData(url, urlPosts) {
    await axios
      .get(url)
      .then((res) => {
        if (!res.data[0]) {
          //redirect
          this.setState({loadingManifestation: false})
        } else {
          this.setState({
            manifestation: res.data[0],
            usersCount: res.data[0].people,
            urlPost: urlPosts + `?manifestationId=${res.data[0].id}`,
            manifestationFonts: [res.data[0].styles.text.title.font, res.data[0].styles.text.subtitle.font, res.data[0].styles.text.body.font],
            loadingManifestation: false,
          });
          const { currentPage: _currentPage, perPage } = this.state;
          const params = `&page=${_currentPage}&perPage=${perPage}`;
          this.fetchTweets(this.state.urlPost+params);

          webFont.load({
            google:{
              families: this.state.manifestationFonts
            }
          })

        }
      })
      .catch((error) => {
        console.log(error.response);
      });
  }

  fetchTweets(url) {
    if (!this.state.loading) {
      const { currentPage: _currentPage, tweets: _tweets } = this.state;
      this.setState({ loading: true });
      axios.get(url).then((res) => {
        const { list: newTweets, total } = res.data;
        const currentPage = _currentPage + 1;
        const tweets = new Set(_tweets.concat(newTweets));

        this.setState({
          tweets: Array.from(tweets),
          currentPage,
          total,
          loading: false,
        });

      });
    }
  }

  fetchUsersCount = () => {
    Api.users.usersCount().then((res) => {
      const { status } = res;
      if (status === 200) {
        this.setState({
          usersCount: res.data.count,
        });
      }
    });
  };

  onEndReached() {
    const { perPage, tweets } = this.state;
    const _perPage = Constants.perPage;
    const page = Math.round(tweets.length / _perPage) + 1;
    const params = `&page=${page}&perPage=${perPage}`;

    this.setState({ currentPage: page, perPage: _perPage });
    this.fetchTweets(this.state.urlPost+`${params}`);
  }

  componentWillUnmount() {
    console.log("removing scroll");
    window.removeEventListener("scroll", this.handleScroll);
  }

  isBottom(element) {
    return (
      document.getElementById("root").getBoundingClientRect().bottom <=
      window.innerHeight
    );
  }

  handleScroll = (e) => {
    const { total, tweets } = this.state;
    const shouldFetchMore = total > tweets.length;
    if (shouldFetchMore && this.isBottom()) {
      this.onEndReached();
    }
  };

  mouseClickHandler = (e, tweet) => {
    clearTimeout(this.timer);
    let ct = { tweet, el: e.target };
    this.setState({ currentTweet: ct });
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

  deleteTweet = (tweetId) => {
    Api.users.deleteTweet(tweetId).then((res) => {
      const { status } = res;
      if (status === 200) {
        console.log("res", res);
        console.log(`Deleted tweet with id: ${tweetId}`);
      }
    });
  };

  banUser = (userTwitterId, manifestationId) => {
    Api.users.banUser(userTwitterId, manifestationId).then((res) => {
      const { status } = res;
      if (status === 201) {
        const {
          data: {
            inserted: { user_id_str },
            removedTweetsCount,
          },
        } = res;
        console.log("res", res);
        console.log(`Banned user with twitter id: ${user_id_str}`);
        console.log(`Deleted ${removedTweetsCount} tweets`);
        const tweetsNotBanned = _.reject(this.state.tweets, function(el) { return el.user.id_str === user_id_str; });
        this.setState({tweets: Array.from(tweetsNotBanned)})
      }
    });
  };

  keyPressed = (e) => {
    if (e.keyCode === 77 && e.shiftKey) {
      this.props.history.push("/moderar");
    }
  };



  render() {
    return (
      <Container ref={this.container} className="App">
        <ThemeProvider theme={theme}>
          <Route path="/">
            <Manifestation
              loadingManifestation= {this.state.loadingManifestation}
              
              backgroundColor={this.state.manifestation.styles.colors.background}
              onScroll={this.handleScroll}

              title={this.state.manifestation.title}
              subtitle={this.state.manifestation.subtitle}
              background={this.state.manifestation.images.header.src}
              logoImgAlt={this.state.manifestation.name}
              count={this.state.manifestation.people}
              countImgSrc=""
              text={this.state.manifestation.description}
              hashtags={this.state.manifestation.hashtags}
              
              /*STYLES*/ 
    
              titleColor={this.state.manifestation.styles.text.title.color}
              titleFont={this.state.manifestation.styles.text.title.font}
              subtitleColor={this.state.manifestation.styles.text.subtitle.color}
              subtitleFont={this.state.manifestation.styles.text.subtitle.font}
              textColor={this.state.manifestation.styles.text.subtitle.color}
              textFont={this.state.manifestation.styles.text.subtitle.font}
              hashtagFontColor={this.state.manifestation.styles.colors.background}
              hashtagContainerColor={this.state.manifestation.styles.colors.accent}
              hashtagFont={this.state.manifestation.styles.text.subtitle.font}
              counterColor={this.state.manifestation.styles.text.subtitle.color}
              counterFont={this.state.manifestation.styles.text.subtitle.font}
              leadClosingColor={this.state.manifestation.styles.text.subtitle.color}
              leadClosingFont={this.state.manifestation.styles.text.subtitle.font}

              sponsors={this.state.manifestation.sponsors}
              sponsorsColor={this.state.manifestation.styles.colors.accent}
              sponsorsFont={this.state.manifestation.styles.text.subtitle.font}
    
              columns={this.state.manifestation.styles.thumbnails.columns} 
              posts={this.state.tweets}
              mouseClickHandler={this.mouseClickHandler}
              mouseEnterHandler={this.mouseEnterHandler}
              mouseLeaveHandler={this.mouseLeaveHandler}

              isLoading={this.state.loading}
          
              isAuthenticated={this.state.isAuthenticated}
              currentTweet={this.state.currentTweet}
              container={this.container}
              closeCard={this.closeCard}
              deleteTweet={this.deleteTweet}
              banUser={this.banUser} 
        
              footerText={this.state.manifestation.footer}

            ></Manifestation>
          </Route>
          
          <Route path="/moderar">
            <Overlay />
            <Login />
          </Route>
        </ThemeProvider>
      </Container>
    );
  }
}

export default withRouter(App);
