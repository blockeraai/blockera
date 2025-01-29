<?php

namespace Blockera\bootstrap\Contracts;

use Closure;

interface Container {

    /**
     * Determine if the given abstract type has been bound.
     *
     * @param  string $abstract
     * @return bool
     */
    public function bound( $abstract);

    /**
     * Alias a type to a different name.
     *
     * @param  string $abstract
     * @param  string $alias
     * @return void
     *
     * @throws \LogicException
     */
    public function alias( $abstract, $alias);

    /**
     * Assign a set of tags to a given binding.
     *
     * @param  array|string $abstracts
     * @param  array|mixed  ...$tags
     * @return void
     */
    public function tag( $abstracts, $tags);

    /**
     * Resolve all of the bindings for a given tag.
     *
     * @param  string $tag
     * @return iterable
     */
    public function tagged( $tag);

    /**
     * Register a binding with the container.
     *
     * @param  string               $abstract
     * @param  \Closure|string|null $concrete
     * @param  bool                 $shared
     * @return void
     */
    public function bind( $abstract, $concrete = null, $shared = false);

    /**
     * Register a binding if it hasn't already been registered.
     *
     * @param  string               $abstract
     * @param  \Closure|string|null $concrete
     * @param  bool                 $shared
     * @return void
     */
    public function bindIf( $abstract, $concrete = null, $shared = false);

    /**
     * Register a shared binding in the container.
     *
     * @param  string               $abstract
     * @param  \Closure|string|null $concrete
     * @return void
     */
    public function singleton( $abstract, $concrete = null);

    /**
     * Register a shared binding if it hasn't already been registered.
     *
     * @param  string               $abstract
     * @param  \Closure|string|null $concrete
     * @return void
     */
    public function singletonIf( $abstract, $concrete = null);

    /**
     * "Extend" an abstract type in the container.
     *
     * @param  string   $abstract
     * @param  \Closure $closure
     * @return void
     *
     * @throws \InvalidArgumentException
     */
    public function extend( $abstract, Closure $closure);

    /**
     * Register an existing instance as shared in the container.
     *
     * @param  string $abstract
     * @param  mixed  $instance
     * @return mixed
     */
    public function instance( $abstract, $instance);

    /**
     * Add a contextual binding to the container.
     *
     * @param  string          $concrete
     * @param  string          $abstract
     * @param  \Closure|string $implementation
     * @return void
     */
    public function addContextualBinding( $concrete, $abstract, $implementation);

    /**
     * Define a contextual binding.
     *
     * @param  string|array $concrete
     * @return \Illuminate\Contracts\Container\ContextualBindingBuilder
     */
    public function when( $concrete);

    /**
     * Get a closure to resolve the given type from the container.
     *
     * @param  string $abstract
     * @return \Closure
     */
    public function factory( $abstract);

    /**
     * Flush the container of all bindings and resolved instances.
     *
     * @return void
     */
    public function flush();

    /**
     * Resolve the given type from the container.
     *
     * @param  string $abstract
     * @param  array  $parameters
     * @return mixed
     *
     * @throws \Illuminate\Contracts\Container\BindingResolutionException
     */
    public function make( $abstract, array $parameters = []);

    /**
     * Call the given Closure / class@method and inject its dependencies.
     *
     * @param  callable|string $callback
     * @param  array           $parameters
     * @param  string|null     $defaultMethod
     * @return mixed
     */
    public function call( $callback, array $parameters = [], $defaultMethod = null);

    /**
     * Determine if the given abstract type has been resolved.
     *
     * @param  string $abstract
     * @return bool
     */
    public function resolved( $abstract);

    /**
     * Register a new resolving callback.
     *
     * @param  \Closure|string $abstract
     * @param  \Closure|null   $callback
     * @return void
     */
    public function resolving( $abstract, Closure $callback = null);

    /**
     * Register a new after resolving callback.
     *
     * @param  \Closure|string $abstract
     * @param  \Closure|null   $callback
     * @return void
     */
    public function afterResolving( $abstract, Closure $callback = null);

    /**
     * Finds an entry of the container by its identifier and returns it.
     *
     * @param string $id Identifier of the entry to look for.
     *
     * @throws NotFoundExceptionInterface  No entry was found for **this** identifier.
     * @throws ContainerExceptionInterface Error while retrieving the entry.
     *
     * @return mixed Entry.
     */
    public function get( string $id);

    /**
     * Returns true if the container can return an entry for the given identifier.
     * Returns false otherwise.
     *
     * `has($id)` returning true does not mean that `get($id)` will not throw an exception.
     * It does however mean that `get($id)` will not throw a `NotFoundExceptionInterface`.
     *
     * @param string $id Identifier of the entry to look for.
     *
     * @return bool
     */
    public function has( string $id);
}
