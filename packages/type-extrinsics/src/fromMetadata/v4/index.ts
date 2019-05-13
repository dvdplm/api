// Copyright 2017-2019 @polkadot/extrinsics authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { MetadataModule } from '@polkadot/types/Metadata/v4/Metadata';
import { Methods, ModulesWithMethods } from '@polkadot/types/primitive/Method';
import MetadataV4 from '@polkadot/types/Metadata/v4';
import { stringCamelCase } from '@polkadot/util';

import extrinsics from '../../index';
import createUnchecked from './createUnchecked';

/**
 * Extend a storage object with the storage modules & module functions present
 * in the metadata.
 *
 * @param extrinsics - An extrinsics object to be extended.
 * @param metadata - The metadata to extend the storage object against.
 */
export default function fromV4 (metadata: MetadataV4): ModulesWithMethods {
  let indexCount = -1;

  return metadata.modules.reduce((result, module: MetadataModule) => {
    if (module.calls.isNone || module.calls.isEmpty) {
      return result;
    }
    indexCount++;
    const prefix = stringCamelCase(module.prefix.toString());

    result[prefix] = module.calls.unwrap().reduce((newModule, call, index) => {
      const funcName = stringCamelCase(call.name.toString());

      newModule[funcName] = createUnchecked(prefix, funcName, indexCount, call, index);

      return newModule;
    }, {} as Methods);

    return result;
  }, { ...extrinsics });
}