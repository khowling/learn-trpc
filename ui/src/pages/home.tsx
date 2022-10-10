import { useState } from 'react';
import { trpc } from '../utils/trpc';
import { inferProcedureInput, inferProcedureOutput } from '@trpc/server';
import type { AppRouter, WithId } from '../../../server/trcpRouter';
import { itemSKUModel } from '@full-stack-typesafe-ts/server';
import SlideOut from '../components/slideout'
import { Observable, observable } from '@trpc/server/observable';


interface DemoForm {
  setOpen: (open: boolean) => void;
}

function DemoForm({setOpen}: DemoForm) {

  const utils = trpc.useContext();

  const mutation  = trpc.item.add.useMutation({
    async onSuccess() {
      // refetches posts after a post is added
      await utils.item.list.invalidate();
      setOpen(false)
    },
  });

  return (
        <form  
          method="POST"
          onSubmit={async (e) => {

            e.preventDefault();
            const $form = e.currentTarget;
            const values = Object.fromEntries(new FormData($form));


            type Input = inferProcedureInput<AppRouter['item']['add']>;
              
            const input: Input = {
              name: values.name ,
              type: values.type,
              required: values.required && new Date(values.required.toString()),
              additionalInfo: values.additionalInfo?.toString(),
              notifyMe: values.notifyMe === 'on'
            } as Input

            
            
            try {
              //const a = await itemSKUModel.parseAsync(input)
              //await addPost.mutateAsync(input);
              await mutation.mutate(input)
              $form.reset();
              
            } catch (cause) {
              console.error({ cause }, 'Failed to add post');
            }
          }}
          >
          

          <div className="grid grid-cols-1 gap-6">
              <label className="block">
                <span className="text-gray-700">Name</span>
                <input type="text" name="name" className="
                    mt-1
                    block
                    w-full
                    rounded-md
                    bg-gray-100
                    border-transparent
                    focus:border-gray-500 focus:bg-white focus:ring-0
                  " placeholder=""/>
              </label>
              <label className="block">
                <span className="text-gray-700">Type?</span>
                <select name="type" className="
                    block
                    w-full
                    mt-1
                    rounded-md
                    bg-gray-100
                    border-transparent
                    focus:border-gray-500 focus:bg-white focus:ring-0
                  ">
                  <option>Manufactured</option>
                  <option>Purchased</option>
                </select>
              </label>
              <label className="block">
                <span className="text-gray-700">When is your event?</span>
                <input name="required" type="date" className="
                    mt-1
                    block
                    w-full
                    rounded-md
                    bg-gray-100
                    border-transparent
                    focus:border-gray-500 focus:bg-white focus:ring-0
                  "/>
              </label>

              <label className="block">
                <span className="text-gray-700">Additional details</span>
                <textarea name="additionalInfo" className="
                    mt-1
                    block
                    w-full
                    rounded-md
                    bg-gray-100
                    border-transparent
                    focus:border-gray-500 focus:bg-white focus:ring-0
                  " rows={3}></textarea>
              </label>
              <div className="block">
                <div className="mt-2">
                  <div>
                    <label className="inline-flex items-center">
                      <input name="notifyMe" type="checkbox" className="
                          rounded
                          bg-gray-200
                          border-transparent
                          focus:border-transparent focus:bg-gray-200
                          text-gray-700
                          focus:ring-1 focus:ring-offset-2 focus:ring-gray-500
                        "/>
                      <span className="ml-2">Notify Me of Updates</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 py-3 my-6 text-right">
              <button
                  type="button"
                  disabled={mutation.isLoading}
                  onClick={() => setOpen(false)}
                  className="inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 ml-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >Cancel
              </button>
              <button
                type="submit"
                disabled={mutation.isLoading}
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4  ml-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >Save
              </button>
              {mutation.error && (
                <p style={{ color: 'red' }}>{mutation.error.message}</p>
              )}
            </div>
       
        </form>
  )
}

interface ConnectedInfo {
  status: ConnectedStatus,
  message?: string
}

enum ConnectedStatus {
  Connected,
  Trying,
  Error
}

export default function IndexPage() {

  /* Ugly code to get rid of the trpc Observability wrapper */
  type Output = inferProcedureOutput<AppRouter['item']['onAdd']>;
  type ObservableOutput = Extract<Output, Observable<any, any>>;
  type UnpackObservable<X> = X extends Observable<infer I, unknown> ? I : any
  type A = UnpackObservable<ObservableOutput>

  const [dialogOpen, setDialogOpen] = useState(false)
  const [realtimeItems, setRealtimeItems] = useState<A[]>([])
  const [connected, setConnected] = useState({status: ConnectedStatus.Trying} as ConnectedInfo)

  const utils = trpc.useContext();
  const postsQuery = trpc.item.list.useQuery(
    {
      limit: 50,
    });
  
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

  return (

    <div className="container mx-auto">


        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">CRUD & Realtime data with tRPC & MongoAPIs!</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          If you get stuck, check tRPC <a href="https://trpc.io">the docs</a>, write a
          message in the tRPC <a href="https://trpc.io/discord">Discord-channel</a>, or
          write a message in{' '}
          <a href="https://github.com/trpc/trpc/discussions">
            GitHub Discussions
          </a>
          .
        </p>

      <h2 className="my-6  text-2xl font-bold tracking-tight text-gray-900">
        Latest Posts (Query)
        {postsQuery.status === 'loading' && '(loading)'}
      </h2>

      <div className="overflow-x-auto">
        <table className="table table-compact w-full">
          <thead>
            <tr>
              <th></th> 
              <th>Id</th> 
              <th>Name</th> 
              <th>Type</th> 
              <th>Required Date</th> 
              <th>Additional Info</th> 
            </tr>
          </thead> 
          <tbody>
          {postsQuery.data?.map((item, index) => (
            <tr key={index}>
              <th>{index}</th> 
              <td>{item._id}</td> 
              <td>{item.name}</td> 
              <td>{item.type}</td> 
              <td>{item.required?.toString()}</td> 
              <td>{item.additionalInfo}</td> 
            </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="my-6  text-2xl font-bold tracking-tight text-gray-900">Latest Posts (Change Stream)</h2>

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

      <div className="mt-5 overflow-x-auto">
        <table className="table table-compact w-full">
          <thead>
            <tr>
              <th></th> 
              <th>Id</th> 
              <th>Name</th> 
              <th>Type</th> 
              <th>Required Date</th> 
              <th>Additional Info</th> 
            </tr>
          </thead> 
          <tbody>
          {realtimeItems.map((item, index) => (
                <tr key={`R-${index}`}>
                  <th>{`R-${index}`}</th> 
                  <td>{item._id}</td> 
                  <td>{item.name}</td> 
                  <td>{item.type}</td> 
                  <td>{item.required?.toString()}</td> 
                  <td>{item.additionalInfo}</td> 
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <button className="btn btn-wide mt-6" onClick={() => setDialogOpen(true)}>Add</button>

      <SlideOut openprop={dialogOpen} setOpen={setDialogOpen}>
          <DemoForm setOpen={setDialogOpen}/>
      </SlideOut>
    </div>
  );
};