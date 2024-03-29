import React from 'react';
import styled from 'styled-components';

const Footer = styled.footer`
  height: 40px;
  background-color: #eeeeee;
  border-top: 1px solid #999999;
  line-height: 40px;
  text-align: right;
  padding: 0 20px;
  & a {
    color: #222;
    text-decoration: none;
    cursor: pointer;
    &:hover {
      color: #268bd2;
    }
  }
`;

export default Footer;
