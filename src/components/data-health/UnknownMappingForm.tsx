import { memo } from "react"
import { Button, Input, Paper, Stack, SxProps } from "@mui/material"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "components/ui/form"
import { clearMapping } from "data/store/features/codemappings/MappingEditSlice"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import RawKeywordInput from "components/inputs/RawKeyboardInput"
import { CodeMapping } from "data/store/features/codemappings/Types"
import { useAppDispatch } from "data/store"

const formSchema = z.object({
  goodsCode: z.coerce
    .number()
    .positive()
    .int()
    .finite()
    .gte(1, {
      message: "Code can't be empty",
    })
    .lte(99999999, {
      message: "Code can't exceed 9 digits",
    })
    .default(1),
  keywords: z
    .string()
    .array()
    .nonempty({ message: "Type at least one keyword" })
    .max(20, { message: "Please, use not more than 20 tags" }),
})

interface MappingFormData {
  goodsCode: number
  keywords: string[]
}

type MappingObserver = (newData: MappingFormData) => void
type CodeMappingObserver = (newMapping: CodeMapping) => void
interface MappingFormSubmitProps {
  onSubmit: MappingObserver
}

function MappingForm(props: MappingFormData & MappingFormSubmitProps) {
  const { goodsCode, keywords, onSubmit: onFormSubmitListener } = props
  const dispatch = useAppDispatch()
  const onCancel = () => {
    dispatch(clearMapping({}))
  }

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      goodsCode,
      keywords,
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    onFormSubmitListener({
      goodsCode: values.goodsCode,
      keywords: values.keywords,
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 bg-green"
      >
        <Stack direction="column">
          <Stack direction="row" justifyContent="space-between">
            <Button variant="outlined" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Save
            </Button>
          </Stack>
          <FormField
            control={form.control}
            name="goodsCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>NESH / NC8 code</FormLabel>
                <FormControl>
                  <Input placeholder="Enter code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="keywords"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precision</FormLabel>
                <FormControl>
                  <RawKeywordInput value={field.value} />
                </FormControl>
                <FormDescription>
                  Enter comma-separated keywords
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </Stack>
      </form>
    </Form>
  )
}

interface UnknownMappingFormProps {
  mappingToEdit: CodeMapping | null
  valueObserver: CodeMappingObserver
}

const UnknownMappingForm = (props: UnknownMappingFormProps & SxProps) => {
  const { mappingToEdit, valueObserver, ...sxProps } = props
  if (!mappingToEdit) {
    return null
  }

  let parsedCode = parseInt(mappingToEdit.goodsCode!!, 10)
  if (!Number.isFinite(parsedCode)) {
    parsedCode = 1
  }

  return (
    mappingToEdit && (
      <Paper sx={{ width: "100%", height: "100%", ...sxProps }}>
        <MappingForm
          goodsCode={parsedCode}
          keywords={mappingToEdit.precision!!}
          //   onSubmit={(newFormData) => {
          // valueObserver({ ...mappingToEdit, ...newFormData })
          //   }}
        />
      </Paper>
    )
  )
}

export default memo(UnknownMappingForm)
