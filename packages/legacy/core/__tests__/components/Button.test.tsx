import { render } from '@testing-library/react-native'
import React from 'react'

// eslint-disable-next-line import/no-named-as-default
import Button, { ButtonType } from '../../App/components/buttons/Button'
import { BasicAppContext } from '../helpers/app'

describe('Button Component', () => {
  test('Primary renders correctly', () => {
    const tree = render(
      <BasicAppContext>
        <Button
          title={'Hello Primary'}
          accessibilityLabel={'primary'}
          onPress={() => {
            return
          }}
          buttonType={ButtonType.Primary}
        />
      </BasicAppContext>
    )

    expect(tree).toMatchSnapshot()
  })

  test('Secondary renders correctly', () => {
    const tree = render(
      <BasicAppContext>
        <Button
          title={'Hello Secondary'}
          accessibilityLabel={'secondary'}
          onPress={() => {
            return
          }}
          buttonType={ButtonType.Secondary}
        />
      </BasicAppContext>
    )

    expect(tree).toMatchSnapshot()
  })
})
