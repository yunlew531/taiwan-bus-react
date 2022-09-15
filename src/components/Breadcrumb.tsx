import React from 'react';
import styled from '@emotion/styled';
import type { ThemeProps } from 'react-app-env';
import { Link as OriginLink } from 'react-router-dom';

const BreadcrumbStyle = styled.div<ThemeProps>`
  display: flex;
  justify-content: space-between;
  height: 36px;
  font-size: ${({ theme: { fontSizes: { fs_4 } } }) => fs_4};
  line-height: 36px;
  padding: 0 66px;
`;

const TimeTableGroup = styled.div<ThemeProps>`
  display: flex;
  .material-icons-outlined {
    font-size: ${({ theme: { fontSizes: { fs_4 } } }) => fs_4};
    margin-right: 5px;
  }
`;

const CopyLink = styled.button<ThemeProps>`
  display: flex;
  align-items: center;
  font-size: ${({ theme: { fontSizes: { fs_4 } } }) => fs_4};
  border: none;
  background: none;
  transition: transform 0.1s linear;
  margin-right: 15px;
  &:hover {
    transform: scale(1.03);
  }
  &:active {
    transform: scale(0.98);
  }
`;

const TimeTable = styled.button<ThemeProps>`
  display: flex;
  align-items: center;
  font-size: ${({ theme: { fontSizes: { fs_4 } } }) => fs_4};
  border: none;
  background: none;
  transition: transform 0.1s linear;
  &:hover {
    transform: scale(1.03);
  }
  &:active {
    transform: scale(0.98);
  }
`;

const Link = styled(OriginLink)`
display: inline-block;
  transition: transform 0.1s linear;
  &:hover {
    transform: scale(1.03);
  }
  &:active {
    transform: scale(0.98);
  }
`;

interface BreadcrumbProps {
  title: string;
  copy?: boolean;
  timeTable?: boolean;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ title, copy, timeTable }) => {
  return (
    <BreadcrumbStyle>
      <div>
        <Link to="/">首頁</Link>
        <span> / </span>
        <span>{title}</span>
      </div>
      <TimeTableGroup>
        {copy && (
          <CopyLink>
            <span className="material-icons-outlined">insert_link</span>
            <p>複製連結</p>
          </CopyLink>
        )}
        {timeTable && (
          <TimeTable>
            <span className="material-icons-outlined">schedule</span>
            <p>時刻表</p>
          </TimeTable>
        )}
      </TimeTableGroup>
    </BreadcrumbStyle>
  );
};

Breadcrumb.defaultProps = {
  copy: false,
  timeTable: false,
};

export default Breadcrumb;
