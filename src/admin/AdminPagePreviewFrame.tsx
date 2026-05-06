'use client';

import { styled } from '@mui/material/styles';

import type { ReactNode } from 'react';

const PreviewRoot = styled('div')`
  display: flex;
  flex: 1;
  min-height: 0;
  justify-content: center;
  border: 1px solid rgba(127, 35, 44, 0.12);
  border-radius: 4px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.82), rgba(248, 241, 232, 0.92)),
    radial-gradient(circle at top right, rgba(184, 141, 73, 0.14), transparent 26%);
  box-shadow: 0 18px 40px rgba(57, 33, 24, 0.08);
  overflow: hidden;
  padding: 4px;
`;

const PreviewFrame = styled('div')`
  width: 100%;
  height: 100%;
  min-height: 0;
  color: #222;
  background: rgba(255, 255, 255, 0.92);
  border-radius: 4px;
  overflow: auto;
  container: page / inline-size;
`;

interface AdminPagePreviewFrameProps {
  children: ReactNode;
  framePadding?: string;
  maxWidth?: number | string;
}

export function AdminPagePreviewFrame({ children, framePadding, maxWidth }: AdminPagePreviewFrameProps) {
  return (
    <PreviewRoot>
      <PreviewFrame style={{ maxWidth, padding: framePadding }}>{children}</PreviewFrame>
    </PreviewRoot>
  );
}
