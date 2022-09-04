import React from 'react';
import styled from '@emotion/styled';
import type { ThemeProps } from 'react-app-env';

const SearchRouteInputGroup = styled.div<ThemeProps>`
  position: relative;
  input {
    font-size: ${({ theme: { fontSizes: { fs_4 } } }) => fs_4};
    background-color: ${({ theme: { colors: { gray_300 } } }) => gray_300};
    width: 100%;
    height: 36px;
    border: none;
    border-radius: 10px;
    padding: 0 45px 0 15px;
  }
`;

const SearchBtn = styled.button<ThemeProps>`
  position: absolute;
  top: 7px;
  right: 7px;
  border: none;
  background: none;
  transition: transform 0.1s linear, color 0.1s linear;
  .material-icons-outlined {
    font-size: ${({ theme: { fontSizes: { fs_1 } } }) => fs_1};
  }
  &:hover {
    color: ${({ theme: { colors: { gray_700 } } }) => gray_700};
    transform: scale(1.05);
  }
  &:active {
    transform: scale(0.95);
  }
`;

interface ISearch {
  placeholder?: string;
}

const Search: React.FC<ISearch> = ({ placeholder }) => {
  return (
    <SearchRouteInputGroup>
      <input type="text" placeholder={placeholder} />
      <SearchBtn type="button">
        <span className="material-icons-outlined">search</span>
      </SearchBtn>
    </SearchRouteInputGroup>
  );
};

Search.defaultProps = {
  placeholder: '',
};

export default Search;
