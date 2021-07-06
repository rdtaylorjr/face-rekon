/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */
import * as React from 'react';
import { NetInfoState } from '../../src';
interface State {
    netInfoState: NetInfoState | null;
}
export default class Fetch extends React.Component<{}, State> {
    constructor(props: {});
    _onPress: () => Promise<void>;
    render(): JSX.Element;
}
export {};
