/* eslint-disable no-return-assign */
/* eslint-disable no-unused-expressions */
/* eslint-disable spaced-comment */
/* eslint-disable no-restricted-syntax */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import styled from 'styled-components';
import InputData from './components/atoms/InputData/InputData';
import NavBar from './components/molecules/NavBar/NavBar';
import LinkOptions from './components/molecules/LinkOptions/LinkOptions';
import LinksArea from './components/organisms/LinksArea/LinksArea';
import CopyBtn from './components/atoms/CopyBtn/CopyBtn';
import Footer from './components/atoms/Footer/Footer';
import './App.sass';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 1005px;
  min-height: 90vh;
  justify-content: flex-start;
  background-color: white;
`;

const ColumnContainer = styled.div`
  display: flex;
  height: calc(99.9vh - 80px);
`;

const Column = styled.div`
  width: 50%;
  min-width: 400px;
  background-color: #eeeeee;
  word-wrap: break-word;
  font-size: 1.4rem;
`;

const OptionsColumn = styled(Column)`
  padding: 20px;
  border-left: 4px solid #dddddd;
  max-height: calc(100vh-80px);
  overflow: auto;
`;

const NewCodeColumn = styled(Column)`
  display: flex;
  flex-direction: column;
  max-height: calc(100vh-80px);
  background-color: #fff;
  border-left: 4px solid #dddddd;
`;

const NewCodeBtns = styled.div`
  display: flex;
  justify-content: flex-end;
`;

class App extends Component {
  state = {
    srcCode: '',
    uniqueHrefs: [],
    checkboxes: [],
    links: [],
    oneLink: false,
    link: '',
    preUrl: false,
    newCode: '',
    newCodeArea: false,
  };

  handleCode = (e) =>
    this.setState({
      srcCode: e.target.value,
    });

  getLinks = (code) => {
    const div = document.querySelector('.temp');
    div.innerHTML = code;
    const allAnchors = [...document.links];
    const allHrefs = allAnchors.map((item) => item.getAttribute('href'));

    const hrefsWithoutReact = allHrefs.filter(
      (item) => item !== 'https://reactjs.org/',
    );
    const clearedHrefs = hrefsWithoutReact.map((item) =>
      item.replace('https://coder.mtdev.pl/', ''),
    );
    const allNewHrefs = [
      ...clearedHrefs.map((item) =>
        item[item.length - 1] === '/'
          ? item.substring(0, item.length - 1)
          : item,
      ),
    ];
    const uniqueHrefs = [...new Set(allNewHrefs)];
    const links = uniqueHrefs.map((item) => [item, item]);

    this.setState({
      uniqueHrefs,
      checkboxes: uniqueHrefs,
      links,
    });
  };

  copyItem = (item) => {
    const tempContainer = document.querySelector('.temp');
    const tempArea = document.createElement('textarea');
    tempContainer.appendChild(tempArea);
    tempArea.textContent = item;
    tempArea.select();
    document.execCommand('copy');
    tempContainer.removeChild(tempArea);
  };

  handleCheckbox = (e) => {
    const { checkboxes, links, uniqueHrefs } = this.state;
    const { checked, id } = e.target;
    const newCheckboxes = checked
      ? [...checkboxes, id]
      : checkboxes.filter((item) => item !== id);
    const newLinks = links.map((item) =>
      !checked && item.includes(id) ? (item = [id, id]) : item,
    );
    const textAreaClass = `.link${uniqueHrefs.indexOf(id)}`;
    const textArea = document.querySelector(textAreaClass);
    textArea.value = '';
    console.log(textArea);
    this.setState({
      checkboxes: newCheckboxes,
      links: newLinks,
    });
  };

  handleOptionCheckbox = (e) =>
    this.setState({
      [e.target.id]: e.target.checked,
    });

  handleNewLink = (e) => {
    const { id, value } = e.target;
    const { links } = this.state;
    links[id][1] = value;
    this.setState({
      links,
    });
  };

  handleOneLink = (e) => {
    const link = e.target.value;
    this.setState({
      link,
    });
  };

  getBack = () =>
    this.setState({
      link: '',
      newCodeArea: false,
      oneLink: false,
      preUrl: false,
    });

  getNewCode = () => {
    const { srcCode, links, preUrl, oneLink, link } = this.state;
    let newCode = srcCode;
    links.map((item) => {
      const newLink = oneLink ? link : item[1];
      const newPreUrl = item[1] === item[0] ? '' : newLink;
      newCode = preUrl
        ? newCode.split(`"${item[0]}"`).join(`"${newPreUrl + item[0]}"`)
        : newCode.split(`"${item[0]}"`).join(`"${newLink}"`);
      return newCode;
    });

    this.setState({
      newCode,
      newCodeArea: true,
    });
  };

  clearContent = () => {
    document.querySelector('.inputField').value = '';
    this.setState({
      srcCode: '',
      uniqueHrefs: [],
      checkboxes: [],
      links: [],
      oneLink: false,
      link: '',
      preUrl: false,
      newCode: '',
      newCodeArea: false,
    });
  };

  render() {
    const {
      srcCode,
      uniqueHrefs,
      checkboxes,
      oneLink,
      newCode,
      newCodeArea,
    } = this.state;
    return (
      <div className='App'>
        <Wrapper>
          <NavBar
            getLinks={() => this.getLinks(srcCode)}
            getNewCode={this.getNewCode}
            clearContent={this.clearContent}
          />
          <ColumnContainer>
            <Column>
              <InputData
                type='text'
                placeholder='Tu wklej kod!'
                onChange={this.handleCode}
                className='inputField'
              />
            </Column>

            {newCodeArea ? (
              <NewCodeColumn>
                <InputData
                  type='text'
                  onChange={this.handleCode}
                  value={newCode}
                />
                <NewCodeBtns>
                  <CopyBtn onClick={() => this.copyItem(newCode)}>
                    kopiuj kod
                  </CopyBtn>
                  <CopyBtn onClick={this.getBack}>powrót do opcji</CopyBtn>
                </NewCodeBtns>
              </NewCodeColumn>
            ) : (
              <OptionsColumn>
                {checkboxes.length !== 0 ? (
                  <LinkOptions
                    handleOptionCheckbox={this.handleOptionCheckbox}
                    oneLink={oneLink}
                    handleOneLink={this.handleOneLink}
                    uniqueHrefs={uniqueHrefs}
                  />
                ) : null}
                <LinksArea
                  uniqueHrefs={uniqueHrefs}
                  checkboxes={checkboxes}
                  handleCheckbox={this.handleCheckbox}
                  oneLink={oneLink}
                  defaultChecked
                  handleNewLink={this.handleNewLink}
                  copyItem={this.copyItem}
                />
              </OptionsColumn>
            )}
          </ColumnContainer>
          <Footer>
            powered by{' '}
            <a
              href='https://reactjs.org/'
              target='_blank'
              rel='noopener noreferrer'
            >
              React
            </a>{' '}
            | &copy; MTDev
          </Footer>
        </Wrapper>
        <div className='temp'>coś</div>
      </div>
    );
  }
}

export default App;
