import VariableSelect from '@common/VariableSelect';
import { Group, NumberInput, Stack, TextInput, Textarea } from '@mantine/core';
import { useDidUpdate } from '@mantine/hooks';
import { Variable } from '@typing/variables';
import { getVariable } from '@variables/variable-manager';
import { useState } from 'react';
import { OperationWrapper } from '../Operations';

export function AddBonusToValOperation(props: {
  variable: string;
  bonusValue: number | undefined;
  bonusType: string | undefined;
  text: string;
  onValueChange: (data: { bonusValue?: number; bonusType?: string; text: string }) => void;
  onSelect: (variable: string) => void;
  onRemove: () => void;
  showTotalVars?: boolean;
  overrideTitle?: string;
}) {
  const [variableName, setVariableName] = useState(props.variable);
  const [variableData, setVariableData] = useState<Variable | undefined>(
    getVariable('CHARACTER', props.variable) ?? undefined
  );
  const [value, setValue] = useState(props.bonusValue);
  const [type, setType] = useState(props.bonusType);
  const [text, setText] = useState(props.text);

  useDidUpdate(() => {
    setVariableName(props.variable);
    setVariableData(getVariable('CHARACTER', props.variable) ?? undefined);
    setValue(props.bonusValue);
    setType(props.bonusType);
    setText(props.text);
  }, [props.variable, props.bonusValue, props.bonusType, props.text]);

  return (
    <OperationWrapper
      onRemove={props.onRemove}
      title={props.overrideTitle ? props.overrideTitle : 'Add Bonus to Value'}
    >
      <Stack>
        <VariableSelect
          value={variableName}
          onChange={(value, variable) => {
            setVariableName(value);
            setVariableData(variable);
            props.onSelect(value);
            setValue(undefined);
            setType(undefined);
            setText('');
          }}
          showTotalVars={props.showTotalVars}
        />
        {variableData && (
          <AddBonusInput
            bonusValue={value}
            bonusType={type}
            text={text}
            onChange={(data) => {
              setValue(data.bonusValue);
              setType(data.bonusType);
              setText(data.text);
              props.onValueChange(data);
            }}
          />
        )}
      </Stack>
    </OperationWrapper>
  );
}

function AddBonusInput(props: {
  bonusValue: number | undefined;
  bonusType: string | undefined;
  text: string;
  onChange: (data: { bonusValue?: number; bonusType?: string; text: string }) => void;
}) {
  return (
    <Stack>
      <Group wrap='nowrap'>
        <NumberInput
          size='xs'
          prefix={(props.bonusValue ?? -1) >= 0 ? '+' : undefined}
          placeholder='Bonus Amount'
          value={props.bonusValue}
          onChange={(value) => props.onChange({ ...props, bonusValue: parseInt(`${value}`) })}
          allowDecimal={false}
        />
        <TextInput
          size='xs'
          placeholder='Bonus Type'
          value={props.bonusType}
          onChange={(event) => props.onChange({ ...props, bonusType: event.target.value })}
        />
      </Group>
      <Textarea
        size='xs'
        placeholder='Conditional Text'
        value={props.text}
        onChange={(event) => props.onChange({ ...props, text: event.target.value })}
        autosize
      />
    </Stack>
  );
}
