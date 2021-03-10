import React from 'react';
import styled, { withTheme } from 'styled-components';
import CardImage from './CardImage';
import CardInfo from './CardInfo';
import CardModeration from './CardModeration';

const CardWrapper = styled.article`
  width: 320px;
  max-width: calc(100% - 30px);
  background-color: #fff;
  position: relative;
  border-radius: 3px;
  overflow: hidden;
  box-shadow: 0 4px 8px -2px rgba(0,0,0,.45);
  margin-bottom: 20px;
  z-index: 10;
`;

const Card = (props) => {

  return (
    <CardWrapper className="Card" onMouseLeave={props.close}>
      <CardImage media={props.tweet.media} source={props.tweet.source} user={props.tweet.user} />
      <CardInfo date={props.tweet.post_created_at} text={props.tweet.full_text} author={props.tweet.user} source={props.tweet.source} />
      { props.show && <CardModeration user={props.tweet.user.screen_name} delete={() => props.delete(props.tweet._id)} block={() => props.block(props.tweet.user.id_str)} />}
    </CardWrapper>
  );
}

export default withTheme(React.memo(Card));