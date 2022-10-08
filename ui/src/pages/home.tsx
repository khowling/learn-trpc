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

  const addPost = trpc.item.add.useMutation({
    async onSuccess() {
      // refetches posts after a post is added
      await utils.item.list.invalidate();
    },
  });


  return (
    <>
        <form  
          method="POST"
          onSubmit={async (e) => {
            /**
             * In a real app you probably don't want to use this manually
             * Checkout React Hook Form - it works great with tRPC
             * @see https://react-hook-form.com/
             * @see https://kitchen-sink.trpc.io/react-hook-form
             */
            e.preventDefault();
            const $form = e.currentTarget;
            const values = Object.fromEntries(new FormData($form));

            type Input = inferProcedureInput<AppRouter['item']['add']>;
              
            const input: Input = {
              name: values.name ,
              type: values.type,
              tags: values.tags,
            } as Input

            
            
            try {
              //const a = await itemSKUModel.parseAsync(input)
              await addPost.mutateAsync(input);
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
                  <option>Corporate event</option>
                  <option>Wedding</option>
                  <option>Birthday</option>
                  <option>Other</option>
                </select>
              </label>
              <label className="block">
                <span className="text-gray-700">Email address</span>
                <input type="email" className="
                    mt-1
                    block
                    w-full
                    rounded-md
                    bg-gray-100
                    border-transparent
                    focus:border-gray-500 focus:bg-white focus:ring-0
                  " placeholder="john@example.com"/>
              </label>
              <label className="block">
                <span className="text-gray-700">When is your event?</span>
                <input type="date" className="
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
                <textarea className="
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
                      <input type="checkbox" className="
                          rounded
                          bg-gray-200
                          border-transparent
                          focus:border-transparent focus:bg-gray-200
                          text-gray-700
                          focus:ring-1 focus:ring-offset-2 focus:ring-gray-500
                        "/>
                      <span className="ml-2">Email me news and special offers</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 py-3 text-right sm:px-6">
              <button
                  onClick={() => setOpen(false)}
                  className="inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >Cancel
              </button>
              <button
                type="submit"
                disabled={addPost.isLoading}
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >Save
              </button>
              {addPost.error && (
                <p style={{ color: 'red' }}>{addPost.error.message}</p>
              )}
            </div>
       
        </form>
         
      </>
  )
}


export default function IndexPage() {

  /* Ugly code to get rid of the trpc Observability wrapper */
  type Output = inferProcedureOutput<AppRouter['item']['onAdd']>;
  type UnpackObservable<X> = X extends Observable<infer I, unknown> ? I : any
  type A = UnpackObservable<Output>

  

  const [dialogOpen, setDialogOpen] = useState(false)
  const [realtimeItems, setRealtimeItems] = useState<A[]>([])

  const utils = trpc.useContext();
  const postsQuery = trpc.item.list.useQuery(
    {
      limit: 5,
    });
  

  trpc.item.onAdd.useSubscription(undefined, {
      onData(data) {
        setRealtimeItems((p) => {
          console.log (data)
          return p.concat(data)
        })
      },
      onError(err) {
        console.error('Subscription error:', err);
        // we might have missed a message - invalidate cache
      },
    });

  return (

    <div className="container mx-auto">


        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Welcome to your tRPC starter!</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          If you get stuck, check <a href="https://trpc.io">the docs</a>, write a
          message in our <a href="https://trpc.io/discord">Discord-channel</a>, or
          write a message in{' '}
          <a href="https://github.com/trpc/trpc/discussions">
            GitHub Discussions
          </a>
          .
        </p>

      <h2>
        Latest Posts
        {postsQuery.status === 'loading' && '(loading)'}
      </h2>

      {postsQuery.data?.map((item, index) => (

            <article key={item._id?.toString()}>
              <h3>{item.name}</h3>
              <p>{item.type}</p>
              <p>{item.tags}</p>
            </article>

      ))}

      <h2>
        Real time Posts
      </h2>

      {realtimeItems.map((item: A, index) => (

      <article key={item._id.toString()}>
        <h3>{item.name}</h3>
        <p>{item.type}</p>
        <p>{item.tags}</p>
      </article>

      ))}

      <hr />

      <button className="btn" onClick={() => setDialogOpen(true)}>Open</button>

      <SlideOut openprop={dialogOpen} setOpen={setDialogOpen}>
          <DemoForm setOpen={setDialogOpen}/>
      </SlideOut>
    </div>
  );
};