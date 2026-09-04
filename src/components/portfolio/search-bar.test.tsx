import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

jest.mock('@/components/themed-view', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    ThemedView: ({ children, ...props }: any) => React.createElement(View, props, children),
  };
});

import { SearchBar } from './search-bar';

describe('SearchBar', () => {
  it('shows the clear button when there is text and clears the value on press', () => {
    const onChangeText = jest.fn();
    const { getByLabelText, queryByLabelText, rerender } = render(
      <SearchBar value="apple" onChangeText={onChangeText} />,
    );

    expect(getByLabelText('Clear search text')).toBeTruthy();

    fireEvent.press(getByLabelText('Clear search text'));
    expect(onChangeText).toHaveBeenCalledWith('');

    rerender(<SearchBar value="" onChangeText={onChangeText} />);
    expect(queryByLabelText('Clear search text')).toBeNull();
  });
});
