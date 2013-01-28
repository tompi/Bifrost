﻿#region License
//
// Copyright (c) 2008-2012, DoLittle Studios AS and Komplett ASA
//
// Licensed under the Microsoft Permissive License (Ms-PL), Version 1.1 (the "License")
// With one exception :
//   Commercial libraries that is based partly or fully on Bifrost and is sold commercially, 
//   must obtain a commercial license.
//
// You may not use this file except in compliance with the License.
// You may obtain a copy of the license at 
//
//   http://bifrost.codeplex.com/license
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
#endregion
using System;
using System.Collections.Generic;

namespace Bifrost.Security
{
    /// <summary>
    /// Defines something that can be secured
    /// </summary>
    public interface ISecurable
    {
        /// <summary>
        /// Add a <see cref="ISecurityActor"/> as context for rules
        /// </summary>
        /// <param name="securityObject">The <see cref="ISecurityActor"/> providing context for the rule</param>
        void AddActor(ISecurityActor securityObject);

        /// <summary>
        /// Gets a collection of <see cref="ISecurityActor">security objects</see>
        /// </summary>
        IEnumerable<ISecurityActor> Actors { get; }

        /// <summary>
        /// Indicates whether this securable can authorize the action 
        /// </summary>
        /// <param name="actionToAuthorize">Instance of an action to be authorized</param>
        /// <returns>True for can authorize, False for cannot</returns>
        bool CanAuthorize(object actionToAuthorize);

        /// <summary>
        /// Result of the authorization of this securable
        /// </summary>
        /// <param name="actionToAuthorize">Instance of an action to be authorized</param>
        /// <returns>An <see cref="AuthorizeSecurableResult"/> </returns>
        AuthorizeSecurableResult Authorize(object actionToAuthorize);

        /// <summary>
        /// Gets a description of the Securable.
        /// </summary>
        string Description { get; } 
    }
}
