import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react'
import { trpc } from '../utils/trpc';
import { inferProcedureInput } from '@trpc/server';
import type { AppRouter } from '../../../server/trcpRouter';



function MultiSelect() {
  return (


<div className="w-full md:w-1/2 flex flex-col items-center h-64 mx-auto">
    <div className="w-full px-4">
        <div className="flex flex-col items-center relative">
            <div className="w-full  svelte-1l8159u">
                <div className="my-2 p-1 flex border border-gray-200 bg-white rounded svelte-1l8159u">
                    <div className="flex flex-auto flex-wrap">
                        <div className="flex justify-center items-center m-1 font-medium py-1 px-2 bg-white rounded-full text-teal-700 bg-teal-100 border border-teal-300 ">
                            <div className="text-xs font-normal leading-none max-w-full flex-initial">HTML</div>
                            <div className="flex flex-auto flex-row-reverse">
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x cursor-pointer hover:text-teal-400 rounded-full w-4 h-4 ml-2">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center items-center m-1 font-medium py-1 px-2 bg-white rounded-full text-teal-700 bg-teal-100 border border-teal-300 ">
                            <div className="text-xs font-normal leading-none max-w-full flex-initial">Ruby</div>
                            <div className="flex flex-auto flex-row-reverse">
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x cursor-pointer hover:text-teal-400 rounded-full w-4 h-4 ml-2">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center items-center m-1 font-medium py-1 px-2 bg-white rounded-full text-teal-700 bg-teal-100 border border-teal-300 ">
                            <div className="text-xs font-normal leading-none max-w-full flex-initial">Javascript</div>
                            <div className="flex flex-auto flex-row-reverse">
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x cursor-pointer hover:text-teal-400 rounded-full w-4 h-4 ml-2">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1">
                            <input placeholder="" className="bg-transparent p-1 px-2 appearance-none outline-none h-full w-full text-gray-800"/>
                        </div>
                    </div>
                    <div className="text-gray-300 w-8 py-1 pl-2 pr-1 border-l flex items-center border-gray-200 svelte-1l8159u">
                        <button className="cursor-pointer w-6 h-6 text-gray-600 outline-none focus:outline-none">
                            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-up w-4 h-4">
                                <polyline points="18 15 12 9 6 15"></polyline>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <div className="absolute shadow top-100 bg-white z-40 w-full lef-0 rounded max-h-select overflow-y-auto svelte-5uyqqj">
                <div className="flex flex-col w-full">
                    <div className="cursor-pointer w-full border-gray-100 rounded-t border-b hover:bg-teal-100">
                        <div className="flex w-full items-center p-2 pl-2 border-transparent border-l-2 relative hover:border-teal-100">
                            <div className="w-full items-center flex">
                                <div className="mx-2 leading-6  ">Python </div>
                            </div>
                        </div>
                    </div>
                    <div className="cursor-pointer w-full border-gray-100 border-b hover:bg-teal-100">
                        <div className="flex w-full items-center p-2 pl-2 border-transparent border-l-2 relative border-teal-600">
                            <div className="w-full items-center flex">
                                <div className="mx-2 leading-6  ">Javascript </div>
                            </div>
                        </div>
                    </div>
                    <div className="cursor-pointer w-full border-gray-100 border-b hover:bg-teal-100">
                        <div className="flex w-full items-center p-2 pl-2 border-transparent border-l-2 relative border-teal-600">
                            <div className="w-full items-center flex">
                                <div className="mx-2 leading-6  ">Ruby </div>
                            </div>
                        </div>
                    </div>
                    <div className="cursor-pointer w-full border-gray-100 border-b hover:bg-teal-100">
                        <div className="flex w-full items-center p-2 pl-2 border-transparent border-l-2 relative hover:border-teal-100">
                            <div className="w-full items-center flex">
                                <div className="mx-2 leading-6  ">JAVA </div>
                            </div>
                        </div>
                    </div>
                    <div className="cursor-pointer w-full border-gray-100 border-b hover:bg-teal-100">
                        <div className="flex w-full items-center p-2 pl-2 border-transparent border-l-2 relative hover:border-teal-100">
                            <div className="w-full items-center flex">
                                <div className="mx-2 leading-6  ">ASP.Net </div>
                            </div>
                        </div>
                    </div>
                    <div className="cursor-pointer w-full border-gray-100 border-b hover:bg-teal-100">
                        <div className="flex w-full items-center p-2 pl-2 border-transparent border-l-2 relative hover:border-teal-100">
                            <div className="w-full items-center flex">
                                <div className="mx-2 leading-6  ">C++ </div>
                            </div>
                        </div>
                    </div>
                    <div className="cursor-pointer w-full border-gray-100 border-b hover:bg-teal-100">
                        <div className="flex w-full items-center p-2 pl-2 border-transparent border-l-2 relative hover:border-teal-100">
                            <div className="w-full items-center flex">
                                <div className="mx-2 leading-6  ">SQL </div>
                            </div>
                        </div>
                    </div>
                    <div className="cursor-pointer w-full border-gray-100 rounded-b hover:bg-teal-100">
                        <div className="flex w-full items-center p-2 pl-2 border-transparent border-l-2 relative border-teal-600">
                            <div className="w-full items-center flex">
                                <div className="mx-2 leading-6  ">HTML </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
  )
}


function DemoForm() {
  return (
    <>

            <form action="#" method="POST">
              <div className="shadow sm:overflow-hidden sm:rounded-md">
                <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-3 sm:col-span-2">
                      <label htmlFor="company-website" className="block text-sm font-medium text-gray-700">
                        Website
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
                          http://
                        </span>
                        <input
                          type="text"
                          name="company-website"
                          id="company-website"
                          className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="www.example.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                      About
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="about"
                        name="about"
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="you@example.com"
                        defaultValue={''}
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Brief description for your profile. URLs are hyperlinked.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Photo</label>
                    <div className="mt-1 flex items-center">
                      <span className="inline-block h-12 w-12 overflow-hidden rounded-full bg-gray-100">
                        <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </span>
                      <button
                        type="button"
                        className="ml-5 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        Change
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Cover photo</label>
                    <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                      <div className="space-y-1 text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                          >
                            <span>Upload a file</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                  <button
                    type="submit"
                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
         
      </>
  )
}

interface Slider {
  openprop: boolean;
  setOpen: (open: boolean) => void;
  children: React.ReactNode;
}

function Slider({openprop, setOpen, children}: Slider) {


  return (
    <Transition.Root show={openprop} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-0 left-0 -ml-8 flex pt-4 pr-2 sm:-ml-10 sm:pr-4">
                      <button
                        type="button"
                        className="rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                        onClick={() => setOpen(false)}
                      >
                        <span className="sr-only">Close panel</span>
                        close
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                    <div className="px-4 sm:px-6">
                      <Dialog.Title className="text-lg font-medium text-gray-900">Panel title</Dialog.Title>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                      {/* Replace with your content */}
                      {children}
                      {/* /End replace */}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}



export default function IndexPage() {

  const [dialogOpen, setDialogOpen] = useState(false)
  const utils = trpc.useContext();
  const postsQuery = trpc.user.list.useQuery(
    {
      limit: 5,
    });

  const addPost = trpc.user.add.useMutation({
    async onSuccess() {
      // refetches posts after a post is added
      await utils.user.list.invalidate();
    },
  });

  // prefetch all posts for instant navigation
  // useEffect(() => {
  //   const allPosts = postsQuery.data?.pages.flatMap((page) => page.items) ?? [];
  //   for (const { id } of allPosts) {
  //     void utils.post.byId.prefetch({ id });
  //   }
  // }, [postsQuery.data, utils]);

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

            <article key={item._id.toString()}>
              <h3>{item.name}</h3>
              <p>{item.type}</p>
              <p>{item.tags}</p>
            </article>

      ))}

      <hr />

      <h3>Add a User</h3>

      <form className="mt-8 space-y-6"
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

          /*
          type Input = inferProcedureInput<AppRouter['user']['add']>;
            
          const input: Input = {
            name: values.name as string,
            type: values.type as "Manufactured" | "Purchased",
            tags: values.tags as string[]

          }
          */
          try {
            await addPost.mutateAsync({name: 'wer', type: "Manufactured", tags: ['123']});
            $form.reset();
          } catch (cause) {
            console.error({ cause }, 'Failed to add post');
          }
        }}
      >
        <div className="-space-y-px rounded-md shadow-sm">
          <div>
            <label htmlFor="email-address" className="sr-only">
              <input id="name" name="name"  type="text" disabled={addPost.isLoading} placeholder="Type here" className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"/>
            </label>
          </div>
        </div>
        <br />
        <label htmlFor="type">Type:</label>
        <br />
        <select id="type" name="type" className="select select-ghost w-full max-w-xs">
          <option disabled selected>Pick the best JS framework</option>
          <option>Svelte</option>
          <option>Vue</option>
          <option>React</option>
        </select>
        <br />

        <MultiSelect/>

        <input type="submit" disabled={addPost.isLoading}  className="btn"/>
        {addPost.error && (
          <p style={{ color: 'red' }}>{addPost.error.message}</p>
        )}

      </form>

      <button className="btn" onClick={() => setDialogOpen(true)}>Open</button>

      <Slider openprop={dialogOpen} setOpen={setDialogOpen}>
          <DemoForm/>
      </Slider>
    </div>
  );
};