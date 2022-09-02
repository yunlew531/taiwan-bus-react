import React from 'react';
import styled from '@emotion/styled';
import type { ThemeProps, StationStatus } from 'react-app-env';
import type { PropsWithChildren } from 'react';

const TimeBadgeStyle = styled.span<ThemeProps & { status?: StationStatus }>`
  display: inline-block;
  width: 77px;
  color: ${({ theme: { colors: { white } } }) => white};
  font-size: ${({ theme: { fontSizes: { fs_4 } } }) => fs_4};
  text-align: center;
  margin-right: 18px;
  border-radius: 10px;
  padding: 6px;
  background-color: ${
  ({ status, theme: { colors: { gray_800, secondary, primary } } }) => {
    if (status === '過站') return gray_800;
    if (status === '進站中' || status === '即將進站') return secondary;
    return primary;
  }
};
`;

type TimeBadgeProps = PropsWithChildren & { status: StationStatus };

const TimeBadge: React.FC<TimeBadgeProps> = ({ children, status }) => (
  <TimeBadgeStyle status={status}>{children}</TimeBadgeStyle>
);

export default TimeBadge;
