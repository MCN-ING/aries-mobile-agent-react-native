import {
  CredentialOverlay,
  Field,
  OCABundle,
  OCABundleResolveAllParams,
  OCABundleResolveDefaultParams,
  OCABundleResolvePresentationFieldsParams,
  OCABundleResolverType,
} from '@hyperledger/aries-oca/build/legacy'
import { TOKENS, useServices } from '../container-api'
import { useEffect, useState } from 'react'
import { BaseOverlay, BrandingOverlay, LegacyBrandingOverlay } from '@hyperledger/aries-oca'

type BundleResolverParams<T> = T extends CredentialOverlay<BrandingOverlay | BaseOverlay | LegacyBrandingOverlay>
  ? OCABundleResolveAllParams
  : T extends OCABundle
  ? OCABundleResolveDefaultParams
  : T extends Field[]
  ? OCABundleResolvePresentationFieldsParams
  : never

function isOCABundleResolveDefaultParams(
  params: OCABundleResolveDefaultParams | OCABundleResolveAllParams
): params is OCABundleResolveDefaultParams {
  return 'meta' in params && !('attributes' in params)
}

function isOCABundleResolveAllParams(
  params: OCABundleResolveAllParams | OCABundleResolveDefaultParams
): params is OCABundleResolveAllParams {
  return 'attributes' in params && 'meta' in params
}

function isOCABundleResolvePresentationFieldsParams(params: any): params is OCABundleResolvePresentationFieldsParams {
  return 'attributes' in params && !('meta' in params)
}

export function useBranding<
  T extends CredentialOverlay<BrandingOverlay | BaseOverlay | LegacyBrandingOverlay> | OCABundle | Field
>(params: BundleResolverParams<T>) {
  const [bundleResolver] = useServices([TOKENS.UTIL_OCA_RESOLVER])
  const [overlay, setOverlay] = useState<T>({} as T)

  const bResolver = bundleResolver as OCABundleResolverType

  useEffect(() => {
    if (isOCABundleResolveDefaultParams(params)) {
      bResolver.resolveDefaultBundle(params).then((bundle) => {
        if (bundle) {
          setOverlay(
            (o) =>
              ({
                ...o,
                ...bundle,
                brandingOverlay: bundle.brandingOverlay,
              } as T)
          )
        }
      })
    } else if (isOCABundleResolveAllParams(params)) {
      bResolver.resolveAllBundles(params).then((bundle) => {
        setOverlay(
          (o) =>
            ({
              ...o,
              ...bundle,
              brandingOverlay: bundle.brandingOverlay,
            } as T)
        )
      })
    } else if (isOCABundleResolvePresentationFieldsParams(params)) {
      bResolver.presentationFields(params).then((fields) => {
        setOverlay(
          (o) =>
            ({
              ...o,
              presentationFields: fields,
            } as T)
        )
      })
    } else {
      bResolver.resolve(params).then((bundle) => {
        if (bundle) {
          setOverlay(
            (o) =>
              ({
                ...o,
                ...bundle,
                brandingOverlay: bundle.brandingOverlay,
              } as T)
          )
        }
      })
    }
  }, [params])

  return { overlay }
}
