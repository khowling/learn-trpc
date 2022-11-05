import React, { useEffect, useState } from 'react';
import { trpc } from '../utils/trpc';
import { inferProcedureInput, inferProcedureOutput } from '@trpc/server';
import type { AppRouter, WithId, ZodError } from '../../../server/trcpRouter';
import { itemSKUModel } from '@full-stack-typesafe-ts/server';
import SlideOut from '../components/slideout'
import { Observable, observable } from '@trpc/server/observable';



export default function IndexPage() {

  const [tab, setTab] = useState(0)
  return (
    <div className="container mx-auto">
        <div className="mt-6 flex justify-center space-x-16 ">
          { ["Factory Orders", "Manage Items",,"Stats"].map((t,i) => 
            <a key={i} className={`tab tab-lg ${tab === i ? 'tab-active bg-blue-400': 'bg-white'}`} 
              onClick={() => setTab(i)}><p className="font-sans text-xl uppercase font-extrabold">{t}</p></a>  
          )}
        </div>
        { tab === 0 ?
          <Factory/>
        : tab ===1 ?
          <ItemSKU/>
        : 
          <div>2</div>
        }
    </div>
  )
}

// --------------------------------------------------------------- FACTORY
interface ConnectedInfo {
  status: ConnectedStatus,
  message?: string
}

enum ConnectedStatus {
  Connected,
  Trying,
  Error
}

function Factory() {

  /* Ugly code to get rid of the trpc Observability wrapper */
  type Output = inferProcedureOutput<AppRouter['item']['onAdd']>;
  type ObservableOutput = Extract<Output, Observable<any, any>>;
  type UnpackObservable<X> = X extends Observable<infer I, unknown> ? I : any
  type A = UnpackObservable<ObservableOutput>


  const [connected, setConnected] = useState({status: ConnectedStatus.Trying} as ConnectedInfo)
  const [realtimeItems, setRealtimeItems] = useState<A[]>([])
  const [c, setC] = useState(0)

    
  // this returns a useEffect
  trpc.item.onAdd.useSubscription(undefined, {
    onStarted() {
      setConnected({status: ConnectedStatus.Connected})
    },
    onData(data) {
      setRealtimeItems((p) => {
        console.log (data)
        return p.concat(data)
      })
    },
    onError(err) {
      setConnected({status: ConnectedStatus.Error, message: err.message})
      console.error('Subscription error:', err);
      // we might have missed a message - invalidate cache
    },
  });

  useEffect(() => {
    const t = setInterval(() => setC((o) => o+1), 200)
    return () => clearInterval(t)
  },[])

  return (
    <>
      <div className="mt-7"></div>
      { connected.status === ConnectedStatus.Trying ? 
        <div className="alert alert-warning shadow-lg">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <span>Trying to connect to Log.....</span>
          </div>
        </div>
        : connected.status === ConnectedStatus.Error ? 
            <div className="alert alert-error shadow-lg">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>Error! Cannot connect: {connected.message}</span>
            </div>
          </div>
        :
        <div className="alert alert-success shadow-lg">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>Connected to live data stream</span>
          </div>
        </div>
      }

      <div className="mt-7 place-content-center grid grid-flow-col gap-10 p-5 text-center auto-cols-max border-solid rounded-md border border-slate" >
       
        <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
          <span className="countdown font-mono text-5xl">
          {c}
          </span>
          Sequence Number
        </div> 
        <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
          <span className="countdown font-mono text-5xl">
            {c}
          </span>
          Orders In Progress
        </div> 
        <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
          <span className="countdown font-mono text-5xl">
            {c}
          </span>
          Orders Completed
        </div> 
      </div>



      <div className="mt-7 flex flex-row flex-nowrap gap-1">
        { ["keith", "wrgerg", "234234", "erwer","fwrerg"].map ((t,i) => 
        
        <div key={i} className="basis-1/5">
          <p className="text-center font-sans text-l uppercase font-bold bg-green-400 rounded-full mx-2 py-1">{t}</p>
          <div className="flex flex-col rounded-md bg-slate-50 gap-2 p-2">
            { ["item1", "item2", "item1", "item2"].map ((t,i2) => 
              
              <a key={i2} onClick={console.log} className="hover:bg-blue-500 hover:ring-blue-500 hover:shadow-md group rounded-md p-2 bg-white ring-1 ring-slate-200 shadow-sm text-sm leading-6">
                <dl className="grid sm:block lg:grid xl:block grid-cols-2 grid-rows-2 items-center">
                  <div className="group-hover:text-white font-semibold text-slate-900">
                      {t}
                  </div>
                  <dl className="mt-2 flex flex-wrap text-sm leading-6 font-medium text-slate-500">
                    <div>
                      <dt className="sr-only">Rating</dt>
                      <dd className="px-1.5 ring-1 ring-slate-200 rounded">PG</dd>
                    </div>
                    <div className="ml-2">
                      <dt className="sr-only">Year</dt>
                      <dd>2344</dd>
                    </div>
                    <div>
                      <dt className="sr-only">Genre</dt>
                      <dd className="flex items-center">
                        <svg width="2" height="2" fill="currentColor" className="mx-2 text-slate-300" aria-hidden="true">
                          <circle cx="1" cy="1" r="1" />
                        </svg>
                        Com
                      </dd>
                    </div>
                    <div>
                      <dt className="sr-only">Runtime</dt>
                      <dd className="flex items-center">
                        <svg width="2" height="2" fill="currentColor" className="mx-2 text-slate-300" aria-hidden="true">
                          <circle cx="1" cy="1" r="1" />
                        </svg>
                        0m 1s
                      </dd>
                    </div>
                  </dl>
                  <div>
                    <dt className="sr-only">Category</dt>
                    <dd className="group-hover:text-blue-200">{t}</dd>
                  </div>
                 
                </dl>
              </a>
            
            )}
            { i === 0 &&
            <a href="/new" className="hover:border-blue-500 hover:border-solid hover:bg-white hover:text-blue-500 group w-full flex flex-col items-center justify-center rounded-md border-2 border-dashed border-slate-300 text-sm leading-6 text-slate-900 font-medium py-3">
              <svg className="group-hover:text-blue-500 mb-1 text-slate-400" width="20" height="20" fill="currentColor" aria-hidden="true">
                <path d="M10 5a1 1 0 0 1 1 1v3h3a1 1 0 1 1 0 2h-3v3a1 1 0 1 1-2 0v-3H6a1 1 0 1 1 0-2h3V6a1 1 0 0 1 1-1Z" />
              </svg>
              New Factory Order
            </a>
            }
            
          </div>
        </div>
        
        )}
        
      </div>
    </>
  )
}


// --------------------------------------------------------------- ItemSKU

interface DialogInterface { 
  open: boolean; 
  recordId?: string; 
}

function ItemSKU() {

  const [dialog, setDialog] = useState<DialogInterface>({open: false})

  const utils = trpc.useContext();
  const { status, data } = trpc.item.list.useQuery({ limit: 50 })

  console.log ('render ItemSKU', status)


  return (
    <>
      
      <h2 className="my-6  text-2xl font-bold tracking-tight text-gray-900">
        Latest Posts (Query)
        {status === 'loading' && '(loading)'}
      </h2>

      <div className="overflow-x-auto">
        <table className="table table-compact w-full">
          <thead>
            <tr>
              <th>Name</th> 
              <th>Type</th> 
              <th>Required Date</th> 
              <th>Additional Info</th>
              <th>Notify Me</th> 
            </tr>
          </thead> 
          <tbody>
          {data?.map((item, index) => (
            <tr className="hover" key={index} onClick={() => setDialog({open: true, recordId: item._id})}>
              
              <td>{item.name}</td> 
              <td>{item.type}</td> 
              <td>{item.required ? new Date(item.required).toDateString() : ''}</td> 
              <td>{item.additionalInfo}</td> 
              <td>{item.notifyMe}</td> 
            </tr>
            ))}
          </tbody>
        </table>
      </div>


      <button className="btn btn-wide mt-6" onClick={() => setDialog({open: true})}>Add</button>

      <SlideOut openprop={dialog.open} setOpen={(open: boolean) => setDialog({open: false})}>
          <DemoForm recordId={dialog.recordId} Close={() => setDialog({open: false})}/>
      </SlideOut>

</>
  )
}

// ------------------------------------------------ Form

interface DemoFormInterface {
  Close: () => void;
  recordId?: string;
}

interface FormErrors {
  [inputName: string]: any
}

type ItemFormData = inferProcedureInput<AppRouter['item']['add']>

interface FormState { 
  data : ItemFormData, 
  errors: FormErrors 
}

function DemoForm({Close, recordId}: DemoFormInterface) {

  console.log ('render DemoForm, recordId:', recordId)

  const emptyData: ItemFormData = {
    name: "",
    type: "Manufactured",
    required: "",
    additionalInfo: "",
    notifyMe: false
  } 
  const [form, setForm] = useState({  data: emptyData, errors: validate(emptyData)} as FormState) 


  const utils = trpc.useContext();
  const { isLoading, isError, data, error } = trpc.item.byId.useQuery({ id: recordId || "dummy" }, {enabled: typeof recordId !== 'undefined', onSuccess: (serverdata) => {
    console.log ('onSuccess', serverdata)
    const data = {...serverdata, ...(serverdata.required && { required: new Date(serverdata.required.toString()).toJSON().split('T')[0] })}
    console.log ('onSuccess', data)
    setForm({ data, errors: validate(data) });
  }})



  function inputUpdate (key: string, value: any) {
    console.log ('inputUpdate', key, value)
    setForm(f => {
      const data = {...f.data, [key]: value}
      return {data, errors: validate(data)}
    })
  }

  function validate(data: ItemFormData ) {
    try {
      const zresult = itemSKUModel.parse(data)
      console.log (zresult)
      return {}
    } catch (e) {
      const zerr = e as ZodError
      const res = zerr.issues.reduce((a: any, c: any) => { return {...a, [c.path[0]]: {...c}}},{})
      return res
    }
  }

  const mutation  = trpc.item.add.useMutation({
    async onSuccess() {
      // refetches posts after a post is added
      await utils.item.list.invalidate();
      Close()
    },
  });

  async function updateItem (e : React.FormEvent<HTMLFormElement>) {
    console.log ('updateItem')
    e.preventDefault();
    const $form = e.currentTarget;
    try {
      //const a = await itemSKUModel.parseAsync(input)
      //await addPost.mutateAsync(input);
      await mutation.mutate(form.data)
      $form.reset();
      
    } catch (cause) {
      console.error({ cause }, 'Failed to add post');
    }
  }

  return (
        <form  onSubmit={updateItem}>
          
          <div className="grid grid-cols-1 gap-6">
              <label className="block">
                <span className="text-gray-700">Name</span>
                <input value={form.data['name']} onChange={e => inputUpdate(e.target.name, e.target.value)} type="text" name="name" className={`
                    ${form.errors['name'] ? 'border-red-500 focus:border-red-500' : 'focus:border-gray-500'}
                    mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:bg-white focus:ring-0`} placeholder=""/>
                { form.errors['name'] && 
                  <span className="ml-1 text-red-500 text-sm">{form.errors['name'].message}</span>
                }
              </label>
              <label className="block">
                <span className="text-gray-700">Type?</span>
                <select value={form.data['type']} onChange={e => inputUpdate(e.target.name, e.target.value)} name="type" className={`
                  ${form.errors['type'] ? 'border-red-500 focus:border-red-500' : 'focus:border-gray-500'}
                    block w-full mt-1 rounded-md bg-gray-100 border-transparent focus:bg-white focus:ring-0`}>
                  <option>Manufactured</option>
                  <option>Purchased</option>
                </select>
                { form.errors['type'] && 
                  <span className="ml-1 text-red-500 text-sm">{form.errors['type'].message}</span>
                }
              </label>
              <label className="block">
                <span className="text-gray-700">When is your event?</span>
                <input value={form.data['required'] as string} onChange={e => inputUpdate(e.target.name, e.target.value)}  name="required" type="date" 
                   className="mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0"/>
                { form.errors['required'] && 
                  <span className="ml-1 text-red-500 text-sm">{form.errors['required'].message}</span>
                }
              </label>

              <label className="block">
                <span className="text-gray-700">Additional details</span>
                <textarea  value={form.data['additionalInfo']} onChange={e => inputUpdate(e.target.name, e.target.value)}  name="additionalInfo" 
                   className="mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0" rows={3}></textarea>
                { form.errors['additionalInfo'] && 
                  <span className="ml-1 text-red-500 text-sm">{form.errors['additionalInfo'].message}</span>
                }
              </label>
              <div className="block">
                <div className="mt-2">
                  <div>
                    <label className="inline-flex items-center">
                      <input value={form.data['notifyMe'] ? 'true' : 'false'}  onChange={e => inputUpdate(e.target.name, e.target.checked)}  name="notifyMe" type="checkbox" 
                          className="rounded bg-gray-200 border-transparent focus:border-transparent focus:bg-gray-200 text-gray-700 focus:ring-1 focus:ring-offset-2 focus:ring-gray-500"/>
                      <span className="ml-2">Notify Me of Updates</span>
                      { form.errors['notifyMe'] && 
                        <span className="ml-1 text-red-500 text-sm">{form.errors['notifyMe'].message}</span>
                      }
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 py-3 my-6 text-right">
              <button
                  type="button"
                  onClick={Close}
                  className="inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 ml-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >Cancel
              </button>
              
              <button
                type="submit"
                disabled={mutation.isLoading || Object.keys(form.errors).length >0}
                className="disabled:opacity-25 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4  ml-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >Save
              </button>
              {mutation.error && (
                <p style={{ color: 'red' }}>{mutation.error.message}</p>
              )}
            </div>
       
        </form>
  )
}